<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingCta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingCtaController extends Controller
{
    public function index()
    {
        $ctas = LandingCta::query()->orderBy('sort_order')->orderByDesc('id')->paginate(20);

        return Inertia::render('Admin/LandingCtas/Index', [
            'ctas' => $ctas,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/LandingCtas/Form', [
            'cta' => null,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        LandingCta::create($data);

        return redirect()->route('admin.content.landing-ctas.index')->with('success', 'CTA created.');
    }

    public function edit(LandingCta $landing_cta)
    {
        return Inertia::render('Admin/LandingCtas/Form', [
            'cta' => $landing_cta,
        ]);
    }

    public function update(Request $request, LandingCta $landing_cta)
    {
        $data = $this->validated($request);
        $landing_cta->update($data);

        return redirect()->route('admin.content.landing-ctas.index')->with('success', 'CTA updated.');
    }

    public function destroy(LandingCta $landing_cta)
    {
        $landing_cta->delete();

        return back()->with('success', 'CTA deleted.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'headline' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'body_text' => 'nullable|string',
            'button_label' => 'required|string|max:100',
            'button_url' => 'required|string|max:500',
            'background_image' => 'nullable|string|max:500',
            'gradient_preset' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);
        $data['is_active'] = $request->boolean('is_active');

        return $data;
    }
}
