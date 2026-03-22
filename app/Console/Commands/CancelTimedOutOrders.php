<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CancelTimedOutOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:cancel-timed-out-orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancel orders that have been pending for more than 5 minutes without payment';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find all pending orders that have timed out (> 5 minutes since payment_attempted_at)
        $timedOutOrders = Order::where('status', 'pending')
            ->where('payment_attempted_at', '<', now()->subMinutes(5))
            ->get();

        if ($timedOutOrders->isEmpty()) {
            $this->info('No pending orders to cancel.');
            return Command::SUCCESS;
        }

        foreach ($timedOutOrders as $order) {
            $order->markCancelled();
            Log::info("Order {$order->order_number} (ID: {$order->id}) auto-cancelled due to 5-minute timeout");
            $this->info("Cancelled order {$order->order_number}");
        }

        $this->info("Cancelled {$timedOutOrders->count()} timed-out orders.");
        return Command::SUCCESS;
    }
}
