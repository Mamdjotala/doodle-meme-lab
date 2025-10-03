import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Image, Download, Share2 } from "lucide-react";
import heroImage from "@/assets/hero-meme.jpg";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MemeGen
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/editor">
              <Button variant="ghost">Editor</Button>
            </Link>
            <Link to="/gallery">
              <Button variant="ghost">Gallery</Button>
            </Link>
            <Link to="/editor">
              <Button variant="hero">Create Meme</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--gradient-hero)] to-background">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                Create Epic Memes in{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Seconds
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Upload images, add hilarious text, and share your creations with the world. 
                The easiest meme generator you'll ever use.
              </p>
              <div className="flex gap-4">
                <Link to="/editor">
                  <Button variant="hero" size="lg" className="text-lg">
                    Start Creating
                    <Sparkles className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/gallery">
                  <Button variant="outline" size="lg" className="text-lg">
                    View Gallery
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full"></div>
              <img 
                src={heroImage} 
                alt="Meme Generator Hero"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Create Amazing Memes
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Image className="w-8 h-8" />}
              title="Easy Upload"
              description="Drag & drop or click to upload any image from your device"
            />
            <FeatureCard 
              icon={<Sparkles className="w-8 h-8" />}
              title="Live Preview"
              description="See your meme come to life with real-time text editing"
            />
            <FeatureCard 
              icon={<Download className="w-8 h-8" />}
              title="Quick Download"
              description="Export your meme in high quality with one click"
            />
            <FeatureCard 
              icon={<Share2 className="w-8 h-8" />}
              title="Easy Sharing"
              description="Share directly to social media or save for later"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-4xl font-bold">
              Ready to Create Your First Meme?
            </h3>
            <p className="text-xl text-muted-foreground">
              Join thousands of creators making viral memes every day
            </p>
            <Link to="/editor">
              <Button variant="hero" size="lg" className="text-lg">
                Get Started Now
                <Sparkles className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 MemeGen. Create. Share. Go Viral.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] hover:shadow-xl transition-shadow">
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Home;
