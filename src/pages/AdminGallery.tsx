import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getGalleryImages, addGalleryImage, removeGalleryImage, type GalleryImage } from "@/lib/galleryStore";
import { Plus, Trash2, Image as ImageIcon, LogOut, Users, Upload, Tag } from "lucide-react";
import { motion } from "framer-motion";
import AdminGuard from "@/components/AdminGuard";
import { logout } from "@/lib/adminAuth";

export default function AdminGallery() {
  const [, navigate] = useLocation();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [newSrc, setNewSrc] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImages(getGalleryImages());
    const handler = () => setImages(getGalleryImages());
    window.addEventListener("galleryUpdated", handler);
    return () => window.removeEventListener("galleryUpdated", handler);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      addGalleryImage(base64, newAlt.trim() || file.name || "Gallery image");
      setImages(getGalleryImages());
      setNewSrc("");
      setNewAlt("");
      setShowAdd(false);
      setUploading(false);
      e.target.value = "";
    };
    reader.onerror = () => {
      alert("Failed to read file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!newSrc.trim()) return;
    addGalleryImage(newSrc.trim(), newAlt.trim() || "Gallery image");
    setImages(getGalleryImages());
    setNewSrc("");
    setNewAlt("");
    setShowAdd(false);
  };

  const handleRemove = (id: string) => {
    removeGalleryImage(id);
    setImages(getGalleryImages());
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0d1117] text-white">
        {/* Header */}
        <div className="border-b border-white/10 bg-[#161b22] sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <h1 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                    <ImageIcon size={20} className="text-green-400" />
                    Gallery Manager
                  </h1>
                  <p className="text-white/30 text-xs mt-0.5">Manage gym photos</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/pronectar-admin-2026/dashboard")}
                    className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    <Users size={14} />
                    Assessments
                  </button>
                  <button
                    onClick={() => navigate("/pronectar-admin-2026/offers")}
                    className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    <Tag size={14} />
                    Offers
                  </button>
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate("/pronectar-admin-2026"); }}
                className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-red-400 border border-white/10 hover:border-red-400/30 rounded-lg text-xs uppercase tracking-widest transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="px-6 py-8">
          <div className="max-w-6xl mx-auto">

            {/* Add button */}
            <div className="mb-8 flex justify-between items-center">
              <p className="text-white/40 text-sm">Total images: <span className="text-white font-bold">{images.length}</span></p>
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-colors"
              >
                <Plus size={16} />
                Add Image
              </button>
            </div>

            {/* Add form */}
            {showAdd && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#161b22] border border-white/10 rounded-xl p-6 mb-8"
              >
                <h3 className="text-white font-black uppercase tracking-wide text-sm mb-5">Add New Image</h3>
                <div className="space-y-5">

                  {/* Alt text — shared for both upload methods */}
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Caption / Alt Text</label>
                    <input
                      type="text"
                      value={newAlt}
                      onChange={e => setNewAlt(e.target.value)}
                      placeholder="e.g. Main gym floor"
                      className="w-full bg-[#0d1117] border border-white/10 focus:border-green-400 focus:outline-none h-11 px-3 text-white placeholder:text-white/20 text-sm rounded-lg transition-colors"
                    />
                  </div>

                  {/* Upload from device */}
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Upload from Device</label>
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 hover:border-green-400/50 rounded-xl cursor-pointer transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                      <div className="flex flex-col items-center gap-2 text-white/30">
                        <Upload size={24} />
                        <span className="text-xs uppercase tracking-widest">
                          {uploading ? "Uploading..." : "Click to choose file"}
                        </span>
                        <span className="text-[10px] text-white/20">JPG, PNG, WEBP, GIF</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-white/20 text-xs uppercase tracking-widest">or use URL</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* URL input */}
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Image URL</label>
                    <input
                      type="text"
                      value={newSrc}
                      onChange={e => setNewSrc(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-[#0d1117] border border-white/10 focus:border-green-400 focus:outline-none h-11 px-3 text-white placeholder:text-white/20 text-sm rounded-lg transition-colors"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAdd}
                      disabled={!newSrc.trim() || uploading}
                      className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-40 text-black font-black uppercase tracking-widest py-2.5 rounded-lg text-xs transition-colors"
                    >
                      Add URL
                    </button>
                    <button
                      onClick={() => { setShowAdd(false); setNewSrc(""); setNewAlt(""); }}
                      className="px-6 text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-lg text-xs uppercase tracking-widest transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="group relative bg-[#161b22] border border-white/10 rounded-xl overflow-hidden">
                  <div className="aspect-[4/3] bg-white/5">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-white/60 truncate">{img.alt}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(img.id)}
                    className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon size={28} className="text-white/20" />
                </div>
                <p className="text-white/40 text-sm">No images yet. Add your first image.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
