"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { DropZone } from "@/components/upload/DropZone";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { BeforeAfter } from "@/components/upload/BeforeAfter";
import { UpscaleOptions } from "@/components/upload/UpscaleOptions";
import type { TargetResolution } from "@/components/upload/UpscaleOptions";
import { DownloadButton } from "@/components/upload/DownloadButton";
import { ProgressIndicator } from "@/components/upload/ProgressIndicator";
import { PricingCard } from "@/components/pricing/PricingCard";
import { BannerAd } from "@/components/ads/BannerAd";
import { Button, ButtonLink } from "@/components/ui/button";
import { PRICING_PLANS } from "@/types";
import type { PricingPlan } from "@/types";

type Step = "upload" | "options" | "processing" | "result" | "error";

export default function HomePage() {
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [target, setTarget] = useState<TargetResolution | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quotaError, setQuotaError] = useState<string | null>(null);

  // Upload file to server
  const handleFileSelect = useCallback(async (f: File) => {
    setFile(f);
    setError(null);
    setQuotaError(null);
    try {
      const formData = new FormData();
      formData.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      const { url } = await res.json();
      setOriginalUrl(url);
      setStep("options");
      document.getElementById("upscale-section")?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }, []);

  // Start upscale
  const handleUpscale = useCallback(async () => {
    if (!originalUrl || !target) return;
    if (!session) {
      signIn("google", { callbackUrl: "/" });
      return;
    }
    setStep("processing");
    setError(null);

    try {
      const res = await fetch("/api/upscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl, target }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setQuotaError(data.error || "No credits");
          setStep("options");
          return;
        }
        throw new Error(data.error || "Upscale failed");
      }

      const falReqId = data.job.replicatePredictionId;

      // Poll for result
      const poll = setInterval(async () => {
        try {
          const r = await fetch(`/api/upscale/${falReqId}`);
          if (!r.ok) return;
          const d = await r.json();
          if (d.status === "completed") {
            clearInterval(poll);
            setResultUrl(d.resultUrl);
            setStep("result");
          } else if (d.status === "failed") {
            clearInterval(poll);
            setError("Processing failed.");
            setStep("error");
          }
        } catch { /* retry */ }
      }, 3000);
      setTimeout(() => clearInterval(poll), 180000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upscale failed");
      setStep("error");
    }
  }, [originalUrl, target]);

  const resetAll = () => {
    setStep("upload");
    setFile(null); setOriginalUrl(null); setTarget(null);
    setResultUrl(null); setError(null); setQuotaError(null);
  };

  const handlePricingSelect = (plan: PricingPlan) => {
    if (plan.price > 0) alert(`${plan.name} — Stripe checkout in production.`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero + Upload */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/25 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-amber-300/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />

        <div className="container mx-auto max-w-4xl px-4 pt-20 pb-12 relative z-10">
          {step === "upload" && !file && (
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-primary mb-6 animate-pulse-glow">
                <SparkleIcon className="w-4 h-4" /> Powered by SeedVR2 AI
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
                Upscale Images with <span className="gradient-text">AI Magic</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Transform low-res images into stunning high-definition masterpieces. Choose your target resolution — up to 4K.
              </p>
            </div>
          )}

          {quotaError && (
            <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-2xl text-center">
              <p className="text-red-600 font-semibold mb-3">{quotaError}</p>
              <button className="text-sm font-semibold text-white px-4 py-2 rounded-xl" style={{ background: "var(--gradient-primary)" }}
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
                View Plans & Upgrade →
              </button>
            </div>
          )}

          <div id="upscale-section">
            {step === "upload" && !file && <DropZone onFileSelect={handleFileSelect} />}

            {step === "upload" && file && (
              <div className="rounded-2xl glass p-6">
                <ImagePreview file={file} onRemove={resetAll} imageUrl={originalUrl ?? undefined} />
              </div>
            )}

            {step === "options" && file && (
              <div className="space-y-6">
                <div className="rounded-2xl glass p-6">
                  <ImagePreview file={file} onRemove={resetAll} imageUrl={originalUrl ?? undefined} />
                </div>
                <div className="rounded-2xl glass p-6 space-y-5">
                  <h2 className="text-xl font-semibold text-center">Choose Target Resolution</h2>
                  <UpscaleOptions selected={target} onSelect={setTarget} disabled={false} />
                  <div className="flex gap-3 justify-center pt-2">
                    <Button size="lg" onClick={handleUpscale} disabled={!target}
                      className="text-base px-10 py-6 h-auto rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-40"
                      style={{ background: target ? "var(--gradient-primary)" : undefined }}>
                      ✨ Upscale to {target}
                    </Button>
                    <Button variant="ghost" onClick={resetAll} className="rounded-xl">Cancel</Button>
                  </div>
                </div>
              </div>
            )}

            {step === "processing" && (
              <div className="rounded-2xl glass p-8 space-y-6">
                <ProgressIndicator status="processing" />
              </div>
            )}

            {step === "result" && resultUrl && originalUrl && (
              <div className="rounded-2xl glass p-6 space-y-6">
                <h2 className="text-xl font-semibold text-center">✨ Compare & Download</h2>
                <BeforeAfter originalUrl={originalUrl} upscaledUrl={resultUrl} />
                <div className="flex flex-wrap gap-3 justify-center">
                  <DownloadButton url={resultUrl} filename={`upscaled-${target}-${file?.name || "image.png"}`} />
                  <Button variant="outline" onClick={resetAll} className="rounded-xl">Upscale Another</Button>
                </div>
                <BannerAd />
              </div>
            )}

            {step === "error" && (
              <div className="rounded-2xl glass p-8 text-center">
                <ProgressIndicator status="failed" error={error ?? undefined} />
                <div className="flex gap-3 justify-center mt-4">
                  <Button onClick={handleUpscale} className="rounded-xl">Retry</Button>
                  <Button variant="outline" onClick={resetAll} className="rounded-xl">Start Over</Button>
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="relative">
          <svg viewBox="0 0 1440 60" fill="var(--background)"><path d="M0 60V30C240 0 480 0 720 15C960 30 1200 45 1440 30V60H0Z" /></svg>
        </div>
      </section>

      <section className="px-4 py-8"><div className="container mx-auto max-w-4xl"><BannerAd /></div></section>

      {/* Demo Gallery */}
      <section id="demo-gallery" className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">See the <span className="gradient-text">Difference</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Drag the slider to compare original low-res images with AI-upscaled results</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DemoCard label="Portrait" imageUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop&q=85" />
            <DemoCard label="Landscape" imageUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop&q=85" />
            <DemoCard label="Wildlife" imageUrl="https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&h=800&fit=crop&q=85" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 gradient-subtle">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why <span className="gradient-text">ImageUpscaler</span>?</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">Built with the latest AI technology</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard icon={<BrainIcon />} title="AI-Powered Engine" description="SeedVR2 model reconstructs details and sharpens edges with stunning accuracy." />
            <FeatureCard icon={<LightningIcon />} title="Lightning Fast" description="Cloud GPU delivers upscaled images in seconds." />
            <FeatureCard icon={<ShieldIcon />} title="Privacy Protected" description="Images auto-deleted. We never share or train on your data." />
            <FeatureCard icon={<ScaleIcon />} title="HD · 2K · 4K" description="Choose your target resolution. We handle the rest." />
            <FeatureCard icon={<FormatIcon />} title="All Major Formats" description="PNG, JPG, JPEG, WEBP, HEIC — drag and drop." />
            <FeatureCard icon={<FreeIcon />} title="Free Every Month" description="5 free credits monthly. No credit card needed." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Choose Your <span className="gradient-text">Plan</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Credits by resolution: HD=1, 2K=2, 4K=5</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {PRICING_PLANS.map((plan) => (<PricingCard key={plan.id} plan={plan} current={false} onSelect={handlePricingSelect} />))}
          </div>
          <div className="text-center mb-12">
            <h3 className="text-lg font-semibold mb-4">One-Time Credit Packs</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <CreditBadge credits={20} price={3} /><CreditBadge credits={50} price={6} /><CreditBadge credits={100} price={10} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <FaqItem q="What is ImageUpscaler?" a="ImageUpscaler uses AI (SeedVR2 model) to upscale low-resolution images into high-definition versions. Choose your target resolution — HD, 2K, or 4K — and our AI handles the rest." />
            <FaqItem q="Is it really free?" a="Yes! Sign in with Google to get 5 free credits every month. Each HD upscale uses 1 credit. Need more? Upgrade to Plus or Pro." />
            <FaqItem q="What image formats are supported?" a="PNG, JPG, JPEG, WEBP, and HEIC. Maximum file size is 25MB." />
            <FaqItem q="How long does upscaling take?" a="Most images process in 10–30 seconds. Larger images or higher target resolutions may take slightly longer." />
            <FaqItem q="Are my images stored?" a="Uploaded images are automatically deleted within 30 days. We do not use your images for training or share them with third parties." />
            <FaqItem q="What resolution should I choose?" a="HD (1080px long edge) is great for social media and web use. 2K (1440px) works well for presentations. 4K (2160px) is ideal for prints and large displays." />
            <FaqItem q="Can I use upscaled images commercially?" a="Yes! The upscaled images are yours. We claim no ownership over your content." />
            <FaqItem q="How do I cancel my subscription?" a="You can cancel anytime from your account settings. Your credits remain until the end of your billing period." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 gradient-subtle">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="relative rounded-3xl p-10 md:p-14 overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Enhance?</h2>
              <p className="text-white/80 mb-8">Start with 5 free credits. No card needed.</p>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-8 py-4 rounded-2xl hover:bg-white/90 transition-all hover:scale-105">Get Started Free →</button>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
          </div>
        </div>
      </section>
    </div>
  );
}

// Demo card with compare slider
function DemoCard({ label, imageUrl }: { label: string; imageUrl: string }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const move = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);
  useEffect(() => {
    if (!dragging) return;
    const up = () => setDragging(false);
    const mm = (e: MouseEvent) => move(e.clientX);
    const tm = (e: TouchEvent) => e.touches[0] && move(e.touches[0].clientX);
    window.addEventListener("mouseup", up); window.addEventListener("mousemove", mm);
    window.addEventListener("touchmove", tm, { passive: false }); window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", mm); window.removeEventListener("touchmove", tm); window.removeEventListener("touchend", up); };
  }, [dragging, move]);
  return (
    <div className="rounded-2xl glass overflow-hidden hover:shadow-lg transition-all">
      <div ref={containerRef} className="relative aspect-square overflow-hidden select-none cursor-ew-resize bg-gray-900">
        <img src={imageUrl} alt={label} className="absolute inset-0 w-full h-full object-cover" loading="lazy" draggable={false} />
        <div className="absolute top-2 right-2 bg-purple-500/90 text-white text-[10px] px-1.5 py-0.5 rounded z-10">AI 4x</div>
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={imageUrl} alt={label} className="absolute inset-0 w-full h-full object-cover blur-[3px] brightness-95 saturate-75" loading="lazy" draggable={false} />
          <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded z-10">Original</div>
        </div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-20" style={{ left: `${pos}%` }}
          onMouseDown={e => { e.preventDefault(); setDragging(true); }}
          onTouchStart={e => { e.preventDefault(); setDragging(true); }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white rounded-full shadow-xl border-2 border-purple-400 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M8 4l8 8-8 8" /></svg>
          </div>
        </div>
      </div>
      <div className="p-3 text-center"><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">← Drag to compare →</p></div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (<div className="group p-6 rounded-2xl glass hover:shadow-lg hover:-translate-y-1 transition-all"><div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 mb-4 group-hover:scale-110 transition-transform">{icon}</div><h3 className="font-semibold mb-2">{title}</h3><p className="text-sm text-muted-foreground">{description}</p></div>);
}
function CreditBadge({ credits, price }: { credits: number; price: number }) {
  return (<div className="rounded-2xl glass p-4 w-40 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"><div className="text-2xl font-bold gradient-text">{credits}</div><div className="text-xs text-muted-foreground mb-1">credits</div><div className="text-lg font-bold mb-2">${price}</div><span className="text-xs text-primary font-medium">Buy Now →</span></div>);
}
function SparkleIcon({ className }: { className?: string }) { return <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M12.736 3.97a.733.733 0 011.294 0l2.345 4.587a.733.733 0 00.537.39l5.048.764c.596.09.834.82.405 1.24l-3.643 3.638a.733.733 0 00-.205.635l.854 5.136c.1.596-.524 1.05-1.06.773l-4.47-2.307a.734.734 0 00-.666 0l-4.47 2.307c-.536.277-1.16-.177-1.06-.773l.854-5.136a.733.733 0 00-.205-.636L4.91 10.95c-.43-.42-.19-1.15.405-1.24l5.048-.764a.733.733 0 00.537-.39l2.345-4.587z" /></svg>; }
function BrainIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>; }
function LightningIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h9v7l9-11h-9z" /></svg>; }
function ShieldIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 12.622 5.176-2.332 9-7.03 9-12.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>; }
function ScaleIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M6 15l3-3 3 3 6-6" /></svg>; }
function FormatIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>; }
function FreeIcon() { return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" /></svg>; }

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl glass p-5 cursor-pointer transition-all duration-200 hover:shadow-sm">
      <summary className="font-medium flex items-center justify-between list-none">
        {q}
        <span className="text-muted-foreground group-open:rotate-45 transition-transform duration-200 text-lg">+</span>
      </summary>
      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{a}</p>
    </details>
  );
}
