<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = Media::with('uploadedBy');

        if ($request->filled('folder')) {
            $query->where('folder', $request->folder);
        }

        if ($request->filled('search')) {
            $query->where('original_filename', 'like', "%{$request->search}%");
        }

        $media = $query->orderBy('created_at', 'desc')->paginate(20);

        $folders = Media::select('folder')
            ->whereNotNull('folder')
            ->distinct()
            ->pluck('folder');

        $heroImageId = Setting::get('hero_image_id');
        $instagramImageIds = Setting::get('instagram_image_ids', []);

        return Inertia::render('Admin/Media/Index', [
            'media' => $media,
            'folders' => $folders,
            'current_folder' => $request->folder,
            'heroImageId' => $heroImageId,
            'instagramImageIds' => $instagramImageIds,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:5120',
            'folder' => 'nullable|string',
        ]);

        foreach ($request->file('files') as $file) {
            $path = $file->store('media', 'public');
            $filename = basename($path);

            Media::create([
                'filename' => $filename,
                'original_filename' => $file->getClientOriginalName(),
                'path' => $path,
                'disk' => 'public',
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'folder' => $validated['folder'] ?? null,
                'uploaded_by' => auth()->id(),
            ]);
        }

        return redirect()->back()->with('success', 'Files uploaded successfully.');
    }

    public function destroy(Media $media)
    {
        Storage::disk('public')->delete($media->path);
        $media->delete();

        return redirect()->back()->with('success', 'Media deleted successfully.');
    }

    public function setHeroImage(Request $request)
    {
        $validated = $request->validate([
            'media_id' => 'required|exists:media,id',
        ]);

        Setting::set('hero_image_id', $validated['media_id'], 'integer', 'Hero image media ID');

        return redirect()->back()->with('success', 'Hero image updated successfully.');
    }

    public function setInstagramImages(Request $request)
    {
        $validated = $request->validate([
            'media_ids' => 'required|array|min:1|max:12',
            'media_ids.*' => 'required|exists:media,id',
        ]);

        Setting::set('instagram_image_ids', $validated['media_ids'], 'array', 'Instagram carousel media IDs');

        return redirect()->back()->with('success', 'Instagram section images updated successfully.');
    }
}

