<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $payments = Auth::user()->orders()
            ->with('payment')
            ->get()
            ->pluck('payment')
            ->filter()
            ->sortByDesc('created_at');

        return Inertia::render('Account/Transactions', [
            'payments' => $payments,
        ]);
    }
}
