import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getOffers, addOffer, removeOffer, updateOffer } from "@/lib/offersStore";
import type { Offer } from "@/data/offers";
import { Plus, Trash2, Edit, LogOut, Users, Tag, Upload, X, Check, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminGuard from "@/components/AdminGuard";
import { logout } from "@/lib/adminAuth";

export default function AdminOffers() {
  const [, navigate] = useLocation();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [badge, setBadge] = useState("");
  const [validTill, setValidTill] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [image, setImage] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);

  useEffect(() => {
    setOffers(getOffers());
    const handler = () => setOffers(getOffers());
    window.addEventListener("offersUpdated", handler);
    return () => window.removeEventListener("offersUpdated", handler);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
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
      if (isEdit && editingOffer) {
        setEditingOffer({ ...editingOffer, image: base64 });
      } else {
        setImage(base64);
      }
      setUploading(false);
    };
    reader.onerror = () => {
      alert("Failed to read file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required");
      return;
    }
    addOffer({
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      discount: discount.trim() || "SPECIAL OFFER",
      badge: badge.trim() || "Limited Time",
      validTill: validTill.trim() || "Limited Slots",
      ctaText: ctaText.trim() || "Claim Offer",
      whatsappMessage: whatsappMessage.trim() || `Hi Muscle Empire! I would like to claim the ${title}.`,
      isFeatured,
      image
    });
    resetForm();
    setShowAdd(false);
  };

  const handleUpdate = () => {
    if (!editingOffer) return;
    updateOffer(editingOffer.id, editingOffer);
    setEditingOffer(null);
  };

  const handleRemove = (id: string) => {
    if (confirm("Are you sure you want to delete this offer?")) {
      removeOffer(id);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setDiscount("");
    setBadge("");
    setValidTill("");
    setCtaText("");
    setWhatsappMessage("");
    setImage("");
    setIsFeatured(true);
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
                    <Tag size={20} className="text-green-400" />
                    Offers Manager
                  </h1>
                  <p className="text-white/30 text-xs mt-0.5">Customize running & upcoming deals</p>
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
                    onClick={() => navigate("/pronectar-admin-2026/gallery")}
                    className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Gallery
                  </button>
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate("/pronectar-admin-2026"); }}
                className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-red-400 border border-white/10 hover:border-red-400/30 rounded-lg text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold uppercase tracking-wider">Active Deals ({offers.length})</h2>
            <button
              onClick={() => { resetForm(); setShowAdd(true); }}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-green-500/20"
            >
              <Plus size={15} />
              Add New Offer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-[#161b22] border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-white/20 transition-all">
                {/* Banner Image */}
                <div className="h-40 bg-white/5 relative flex items-center justify-center overflow-hidden">
                  {offer.image ? (
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                  ) : (
                    <Tag size={40} className="text-white/20" />
                  )}
                  <span className="absolute top-3 right-3 bg-green-500 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full z-10">
                    {offer.discount}
                  </span>
                  <span className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                    {offer.badge}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div>
                    <h3 className="font-black uppercase tracking-tight text-white text-base leading-tight mb-1">{offer.title}</h3>
                    <p className="text-white/40 text-xs font-semibold uppercase">{offer.subtitle || "Exclusive Deal"}</p>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed flex-1">{offer.description}</p>
                  <p className="text-[11px] text-white/45">Valid till: <strong className="text-white/80">{offer.validTill}</strong></p>

                  <div className="flex gap-2.5 pt-3 border-t border-white/10">
                    <button
                      onClick={() => setEditingOffer(offer)}
                      className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer border border-white/5"
                    >
                      <Edit size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(offer.id)}
                      className="h-9 w-9 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors border border-red-500/15 cursor-pointer"
                      title="Delete Offer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Add Offer */}
        <AnimatePresence>
          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8"
              >
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-black uppercase tracking-wider text-sm flex items-center gap-2">
                    <Plus size={16} className="text-green-400" /> Add New Offer
                  </h3>
                  <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Offer Title</label>
                      <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="e.g. New Member Transformation" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Subtitle</label>
                      <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} type="text" placeholder="e.g. Unlock Your Physique" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter details of what is included in this offer..." rows={3} className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-green-400/50 transition-colors resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Discount Badge</label>
                      <input value={discount} onChange={(e) => setDiscount(e.target.value)} type="text" placeholder="e.g. 25% OFF" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Badge Text</label>
                      <input value={badge} onChange={(e) => setBadge(e.target.value)} type="text" placeholder="e.g. Limited Time Special" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Valid Until</label>
                      <input value={validTill} onChange={(e) => setValidTill(e.target.value)} type="text" placeholder="e.g. 31 August 2026" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">CTA Text</label>
                      <input value={ctaText} onChange={(e) => setCtaText(e.target.value)} type="text" placeholder="e.g. Claim Discount" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/50 uppercase tracking-wider font-bold">WhatsApp Message</label>
                    <input value={whatsappMessage} onChange={(e) => setWhatsappMessage(e.target.value)} type="text" placeholder="Enter predefined WhatsApp message..." className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Offer Banner Image</label>
                    <div className="flex items-center gap-4">
                      {image ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                          <img src={image} className="w-full h-full object-cover" />
                          <button onClick={() => setImage("")} className="absolute inset-0 bg-black/60 flex items-center justify-center text-red-500 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="w-20 h-20 bg-white/5 border border-dashed border-white/20 hover:border-green-400/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors">
                          <Upload size={18} className="text-white/40" />
                          <span className="text-[9px] text-white/30 mt-1">Upload</span>
                          <input type="file" onChange={(e) => handleFileUpload(e)} className="hidden" accept="image/*" />
                        </label>
                      )}
                      <p className="text-[10px] text-white/30">Upload a 16:9 banner image for the offer card.</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-white/10 flex gap-3 bg-white/[0.02]">
                  <button onClick={handleAdd} className="flex-1 h-11 bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Check size={16} /> Add Offer
                  </button>
                  <button onClick={() => setShowAdd(false)} className="px-6 h-11 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-xl border border-white/5 cursor-pointer transition-colors">
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Edit Offer */}
        <AnimatePresence>
          {editingOffer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#161b22] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8"
              >
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-black uppercase tracking-wider text-sm flex items-center gap-2">
                    <Edit size={16} className="text-green-400" /> Edit Offer Details
                  </h3>
                  <button onClick={() => setEditingOffer(null)} className="text-white/40 hover:text-white cursor-pointer"><X size={18} /></button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Offer Title</label>
                      <input value={editingOffer.title} onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })} type="text" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Subtitle</label>
                      <input value={editingOffer.subtitle || ""} onChange={(e) => setEditingOffer({ ...editingOffer, subtitle: e.target.value })} type="text" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Description</label>
                    <textarea value={editingOffer.description} onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })} rows={3} className="bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-green-400/50 transition-colors resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Discount Badge</label>
                      <input value={editingOffer.discount} onChange={(e) => setEditingOffer({ ...editingOffer, discount: e.target.value })} type="text" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Badge Text</label>
                      <input value={editingOffer.badge} onChange={(e) => setEditingOffer({ ...editingOffer, badge: e.target.value })} type="text" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Valid Until</label>
                      <input value={editingOffer.validTill} onChange={(e) => setEditingOffer({ ...editingOffer, validTill: e.target.value })} type="text" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-wider font-bold">CTA Text</label>
                      <input value={editingOffer.ctaText} onChange={(e) => setEditingOffer({ ...editingOffer, ctaText: e.target.value })} type="text" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/50 uppercase tracking-wider font-bold">WhatsApp Message</label>
                    <input value={editingOffer.whatsappMessage} onChange={(e) => setEditingOffer({ ...editingOffer, whatsappMessage: e.target.value })} type="text" className="h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-green-400/50 transition-colors" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/50 uppercase tracking-wider font-bold">Offer Banner Image</label>
                    <div className="flex items-center gap-4">
                      {editingOffer.image ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                          <img src={editingOffer.image} className="w-full h-full object-cover" />
                          <button onClick={() => setEditingOffer({ ...editingOffer, image: "" })} className="absolute inset-0 bg-black/60 flex items-center justify-center text-red-500 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="w-20 h-20 bg-white/5 border border-dashed border-white/20 hover:border-green-400/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors">
                          <Upload size={18} className="text-white/40" />
                          <span className="text-[9px] text-white/30 mt-1">Upload</span>
                          <input type="file" onChange={(e) => handleFileUpload(e, true)} className="hidden" accept="image/*" />
                        </label>
                      )}
                      <p className="text-[10px] text-white/30">Replace the offer card banner graphic.</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-white/10 flex gap-3 bg-white/[0.02]">
                  <button onClick={handleUpdate} className="flex-1 h-11 bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Check size={16} /> Save Changes
                  </button>
                  <button onClick={() => setEditingOffer(null)} className="px-6 h-11 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-xl border border-white/5 cursor-pointer transition-colors">
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminGuard>
  );
}
