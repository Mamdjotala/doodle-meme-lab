import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Trash2, Download, Home, Share2 } from "lucide-react";
import { toast } from "sonner";


interface Meme {
  id: number;
  data: string;
  topText: string;
  bottomText: string;
  createdAt: string;
}

const Gallery = () => {
  const [memes, setMemes] = useState<Meme[]>([]);

  useEffect(() => {
    loadMemes();
  }, []);

  const loadMemes = () => {
    const savedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
    setMemes(savedMemes);
  };

  const deleteMeme = (id: number) => {
    const updatedMemes = memes.filter((meme) => meme.id !== id);
    setMemes(updatedMemes);
    localStorage.setItem("memes", JSON.stringify(updatedMemes));
    toast.success("Meme deleted");
  };

  const downloadMeme = (meme: Meme) => {
    const a = document.createElement("a");
    a.href = meme.data;
    a.download = `meme-${meme.id}.png`;
    a.click();
    toast.success("Meme downloaded!");
  };

  const shareMeme = async (meme: Meme, platform: string) => {
    const text = `Check out my meme! ${meme.topText} ${meme.bottomText}`;
    const memeUrl = encodeURIComponent(window.location.origin + "/gallery");

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + memeUrl)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${memeUrl}`, "_blank");
        break;
      case "x":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${memeUrl}`, "_blank");
        break;
      case "instagram":
        // Instagram doesn't support web sharing, so we try native share or download
        if (navigator.share) {
          try {
            const response = await fetch(meme.data);
            const blob = await response.blob();
            const file = new File([blob], `meme-${meme.id}.png`, { type: "image/png" });
            await navigator.share({
              files: [file],
              title: "My Meme",
              text: text,
            });
          } catch (error) {
            toast.error("Share failed. Try downloading instead.");
          }
        } else {
          downloadMeme(meme);
          toast.info("Download the image and share it on Instagram!");
        }
        break;
    }
  };

  return (
    
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MemeGen
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link to="/editor">
              <Button variant="hero">Create Meme</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Your Meme Gallery</h2>
          <p className="text-xl text-muted-foreground">
            {memes.length} meme{memes.length !== 1 ? "s" : ""} created
          </p>
        </div>

        {memes.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
                <Sparkles className="w-12 h-12 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">No Memes Yet</h3>
              <p className="text-muted-foreground">
                Create your first meme and it will appear here!
              </p>
              <Link to="/editor">
                <Button variant="hero" size="lg">
                  Create Your First Meme
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <Card key={meme.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-muted">
                  <img
                    src={meme.data}
                    alt="Meme"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    {meme.topText && (
                      <p className="font-semibold truncate">Top: {meme.topText}</p>
                    )}
                    {meme.bottomText && (
                      <p className="font-semibold truncate">Bottom: {meme.bottomText}</p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(meme.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadMeme(meme)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMeme(meme.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shareMeme(meme, "whatsapp")}
                      className="flex-1"
                      title="Share on WhatsApp"
                    >
<<<<<<< HEAD
=======
                      
>>>>>>> 785d8bc (Ajout du backend meme-share-backend et ShareButtons, modifications Editor et Gallery pour partage des memes)
                      <Share2 className="w-4 h-4" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shareMeme(meme, "facebook")}
                      className="flex-1"
                      title="Share on Facebook"
                    >
                      <Share2 className="w-4 h-4" />
                      Facebook
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shareMeme(meme, "x")}
                      className="flex-1"
                      title="Share on X"
                    >
                      <Share2 className="w-4 h-4" />
                      X
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shareMeme(meme, "instagram")}
                      className="flex-1"
                      title="Share on Instagram"
                    >
                      <Share2 className="w-4 h-4" />
                      Instagram
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;