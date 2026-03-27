<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cart;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Migrate session-based cart to user-based cart
        $this->migrateGuestCartToUserCart();

        return redirect(route('dashboard', absolute: false));
    }

    /**
     * Migrate guest cart items to authenticated user's cart.
     */
    private function migrateGuestCartToUserCart()
    {
        $sessionId = Session::getId();
        $guestCart = Cart::where('session_id', $sessionId)->first();

        if ($guestCart && $guestCart->items->count() > 0) {
            $userCart = Cart::firstOrCreate(['user_id' => Auth::id()]);

            // Move items from guest cart to user cart
            foreach ($guestCart->items as $item) {
                // Check if item already exists in user cart
                $existingItem = $userCart->items()
                    ->where('product_id', $item->product_id)
                    ->where('variant_id', $item->variant_id)
                    ->first();

                if ($existingItem) {
                    $existingItem->update([
                        'quantity' => $existingItem->quantity + $item->quantity,
                    ]);
                } else {
                    $userCart->items()->create([
                        'product_id' => $item->product_id,
                        'variant_id' => $item->variant_id,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                    ]);
                }
            }

            // Delete guest cart
            $guestCart->delete();
        }
    }
}
