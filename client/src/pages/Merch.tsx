import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingBag, Plus, CheckCircle2, Clock, Package } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

interface MerchOrder {
  id: string;
  title: string;
  description: string;
  image: string;
  status: "pending" | "approved" | "in_production" | "shipped";
  createdAt: string;
  estimatedDelivery?: string;
}

export default function Merch() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    design: "",
  });

  const [orders] = useState<MerchOrder[]>([
    {
      id: "1",
      title: "Neon Pixel T-Shirt",
      description: "Custom design featuring Pixel in neon colors",
      image: "👕",
      status: "shipped",
      createdAt: "2026-04-15",
      estimatedDelivery: "2026-05-01",
    },
    {
      id: "2",
      title: "Anom Artsy Hoodie",
      description: "Cozy hoodie with glowing Anom Artsy logo",
      image: "🧥",
      status: "in_production",
      createdAt: "2026-05-01",
      estimatedDelivery: "2026-05-20",
    },
    {
      id: "3",
      title: "Custom Sticker Pack",
      description: "Set of 10 neon-themed stickers",
      image: "🎨",
      status: "approved",
      createdAt: "2026-05-10",
    },
  ]);

  const handleRequestMerch = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Merch request submitted! Our team will review it shortly. 🎉");
    setFormData({ title: "", description: "", design: "" });
    setIsRequestOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-[#ff00cc]" />;
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-[#00eaff]" />;
      case "in_production":
        return <Package className="w-5 h-5 text-[#9d4edd]" />;
      case "shipped":
        return <CheckCircle2 className="w-5 h-5 text-[#00eaff]" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "approved":
        return "Approved";
      case "in_production":
        return "In Production";
      case "shipped":
        return "Shipped";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Merch...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in to access merch</p>
          <Button className="btn-neon-magenta" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#2a2f3e] px-6 py-4 sticky top-0 bg-[#0b0e14]/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#7a7f8e]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold neon-text-magenta">White-Glove Merch</h1>
          </div>
          <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
            <DialogTrigger asChild>
              <Button className="btn-neon-cyan gap-2">
                <Plus className="w-4 h-4" />
                Request Custom Merch
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1f2e] border border-[#2a2f3e]">
              <DialogHeader>
                <DialogTitle className="text-[#ff00cc]">Request Custom Merch</DialogTitle>
                <DialogDescription className="text-[#7a7f8e]">
                  Share your vision and we'll create something amazing for you.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Merch Title</label>
                  <Input
                    placeholder="e.g., Custom Pixel Hoodie"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e]"
                  />
                </div>

                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe your merch idea in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e]"
                  />
                </div>

                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Design Notes (Optional)</label>
                  <Textarea
                    placeholder="Any specific colors, styles, or references?"
                    value={formData.design}
                    onChange={(e) => setFormData({ ...formData, design: e.target.value })}
                    className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e]"
                  />
                </div>

                <Button
                  className="w-full btn-neon-magenta"
                  onClick={handleRequestMerch}
                >
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Info Section */}
        <Card
          className="bg-[#1a1f2e] border border-[#2a2f3e] p-8 mb-12"
          style={{
            boxShadow: "0 0 10px rgba(0, 234, 255, 0.5), 0 0 20px rgba(0, 234, 255, 0.3)",
          }}
        >
          <div className="flex gap-6 items-start">
            <ShoppingBag className="w-12 h-12 text-[#ff00cc] flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-[#00eaff] mb-2">Your Bespoke Merch Experience</h2>
              <p className="text-[#7a7f8e] mb-4">
                We create custom, high-quality merchandise based on your unique vision. From t-shirts to hoodies, stickers to mugs — your ideas come to life through our white-glove service.
              </p>
              <ul className="text-[#7a7f8e] text-sm space-y-2">
                <li>✨ Custom design consultation</li>
                <li>✨ Premium quality materials</li>
                <li>✨ Fast production and shipping</li>
                <li>✨ Satisfaction guaranteed</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Your Orders */}
        <h3 className="text-2xl font-bold text-[#ff00cc] mb-6">Your Orders</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 hover:border-[#ff00cc] transition-colors"
              style={{
                boxShadow: "0 0 10px rgba(255, 0, 204, 0.3), 0 0 20px rgba(255, 0, 204, 0.1)",
              }}
            >
              {/* Order Image */}
              <div className="text-6xl text-center mb-4">{order.image}</div>

              {/* Order Details */}
              <h4 className="text-lg font-bold text-[#00eaff] mb-2">{order.title}</h4>
              <p className="text-sm text-[#7a7f8e] mb-4">{order.description}</p>

              {/* Status */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#2a2f3e]">
                {getStatusIcon(order.status)}
                <span className="text-sm text-[#7a7f8e]">{getStatusLabel(order.status)}</span>
              </div>

              {/* Dates */}
              <div className="text-xs text-[#7a7f8e] space-y-1">
                <p>Requested: {order.createdAt}</p>
                {order.estimatedDelivery && (
                  <p className="text-[#00eaff]">Est. Delivery: {order.estimatedDelivery}</p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Portfolio Section */}
        <h3 className="text-2xl font-bold text-[#ff00cc] mb-6">Completed Pieces Gallery</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { emoji: "👕", title: "Pixel Tee", artist: "Sarah M." },
            { emoji: "🧥", title: "Neon Hoodie", artist: "Alex K." },
            { emoji: "🎨", title: "Sticker Pack", artist: "Jordan L." },
            { emoji: "🎒", title: "Custom Backpack", artist: "Casey R." },
            { emoji: "⌚", title: "Anom Watch", artist: "Morgan T." },
            { emoji: "🧢", title: "Neon Cap", artist: "Riley S." },
            { emoji: "🛍️", title: "Tote Bag", artist: "Taylor N." },
            { emoji: "🎁", title: "Gift Box Set", artist: "Jamie P." },
          ].map((item, idx) => (
            <Card
              key={idx}
              className="bg-[#1a1f2e] border border-[#2a2f3e] p-6 text-center hover:border-[#00eaff] transition-colors"
              style={{
                boxShadow: "0 0 10px rgba(0, 234, 255, 0.3), 0 0 20px rgba(0, 234, 255, 0.1)",
              }}
            >
              <div className="text-5xl mb-3">{item.emoji}</div>
              <h4 className="text-sm font-bold text-[#00eaff] mb-1">{item.title}</h4>
              <p className="text-xs text-[#7a7f8e]">by {item.artist}</p>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-[#ff00cc] mb-4">Ready to Create Something Amazing?</h3>
          <p className="text-[#7a7f8e] mb-6">
            Submit your merch request today and let our team bring your vision to life.
          </p>
          <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
            <DialogTrigger asChild>
              <Button className="btn-neon-magenta gap-2">
                <Plus className="w-4 h-4" />
                Request Custom Merch
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1f2e] border border-[#2a2f3e]">
              <DialogHeader>
                <DialogTitle className="text-[#ff00cc]">Request Custom Merch</DialogTitle>
                <DialogDescription className="text-[#7a7f8e]">
                  Share your vision and we'll create something amazing for you.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Merch Title</label>
                  <Input
                    placeholder="e.g., Custom Pixel Hoodie"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e]"
                  />
                </div>

                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe your merch idea in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e]"
                  />
                </div>

                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Design Notes (Optional)</label>
                  <Textarea
                    placeholder="Any specific colors, styles, or references?"
                    value={formData.design}
                    onChange={(e) => setFormData({ ...formData, design: e.target.value })}
                    className="bg-[#0b0e14] border-[#2a2f3e] text-[#00eaff] placeholder-[#7a7f8e]"
                  />
                </div>

                <Button
                  className="w-full btn-neon-magenta"
                  onClick={handleRequestMerch}
                >
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
