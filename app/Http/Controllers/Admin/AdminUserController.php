<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('is_admin', true)
            ->with('adminRoles');

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        }

        $admins = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Admin/AdminUsers/Index', [
            'admins' => $admins,
            'filters' => ['search' => $request->search],
        ]);
    }

    public function create()
    {
        $roles = Role::all();

        return Inertia::render('Admin/AdminUsers/Form', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'roles' => 'array',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['is_admin'] = true;

        $admin = User::create($validated);

        if ($request->filled('roles')) {
            $admin->adminRoles()->sync($request->roles);
        }

        return redirect()->route('admin.admin-users.index')->with('success', 'Admin user created successfully.');
    }

    public function edit(User $adminUser)
    {
        if (!$adminUser->is_admin) {
            return redirect()->back()->with('error', 'This is not an admin user.');
        }

        $adminUser->load('adminRoles');
        $roles = Role::all();
        $userRoleIds = $adminUser->adminRoles->pluck('id')->toArray();

        return Inertia::render('Admin/AdminUsers/Form', [
            'admin' => $adminUser,
            'roles' => $roles,
            'user_roles' => $userRoleIds,
        ]);
    }

    public function update(Request $request, User $adminUser)
    {
        if (!$adminUser->is_admin) {
            return redirect()->back()->with('error', 'This is not an admin user.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $adminUser->id,
            'phone' => 'nullable|string|max:20',
            'roles' => 'array',
        ]);

        $adminUser->update($validated);

        if ($request->filled('roles')) {
            $adminUser->adminRoles()->sync($request->roles);
        }

        return redirect()->route('admin.admin-users.index')->with('success', 'Admin user updated successfully.');
    }

    public function destroy(User $adminUser)
    {
        if (!$adminUser->is_admin) {
            return redirect()->back()->with('error', 'This is not an admin user.');
        }

        $adminUser->delete();

        return redirect()->route('admin.admin-users.index')->with('success', 'Admin user deleted successfully.');
    }
}
