import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Upload, Download, Home, Palette, Share2 } from "lucide-react";
import { toast } from "sonner";

const Editor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [showShareButtons, setShowShareButtons] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      drawMeme();
    }
  }, [image, topText, bottomText, fontSize, textColor]);

  const drawMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Configure text style
      ctx.fillStyle = textColor;
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = fontSize / 20;
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      // Draw top text
      if (topText) {
        const x = canvas.width / 2;
        const y = 20;
        ctx.strokeText(topText.toUpperCase(), x, y);
        ctx.fillText(topText.toUpperCase(), x, y);
      }

      // Draw bottom text
      if (bottomText) {
        const x = canvas.width / 2;
        const y = canvas.height - fontSize - 20;
        ctx.strokeText(bottomText.toUpperCase(), x, y);
        ctx.fillText(bottomText.toUpperCase(), x, y);
      }
    };
    img.src = image;
  };

  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `meme-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Save to gallery (localStorage)
        const memeData = canvas.toDataURL();
        const savedMemes = JSON.parse(localStorage.getItem("memes") || "[]");
        savedMemes.unshift({
          id: Date.now(),
          data: memeData,
          topText,
          bottomText,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("memes", JSON.stringify(savedMemes.slice(0, 50))); // Keep last 50
        
        toast.success("Meme downloaded and saved to gallery!");
        setShowShareButtons(true);
      }
    });
  };

  const shareMeme = async (platform: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const text = `Check out my meme! ${topText} ${bottomText}`;
    const memeUrl = encodeURIComponent(window.location.origin);

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
        if (navigator.share) {
          try {
            canvas.toBlob(async (blob) => {
              if (blob) {
                const file = new File([blob], `meme-${Date.now()}.png`, { type: "image/png" });
                await navigator.share({
                  files: [file],
                  title: "My Meme",
                  text: text,
                });
              }
            });
          } catch (error) {
            toast.error("Share failed. Meme already downloaded!");
          }
        } else {
          toast.info("Meme downloaded! Share it manually on Instagram.");
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
            <Link to="/gallery">
              <Button variant="ghost">Gallery</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Canvas Area */}
          <div className="space-y-4">
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center min-h-[500px]">
                {!image ? (
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
                      <Upload className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold">Upload an Image</h3>
                    <p className="text-muted-foreground">
                      Choose an image to start creating your meme
                    </p>
                    <Button
                      variant="hero"
                      size="lg"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <canvas
                      ref={canvasRef}
                      className="max-w-full h-auto mx-auto rounded-lg shadow-xl"
                    />
                    <div className="space-y-4 mt-6">
                      <div className="flex justify-center gap-4">
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Image
                        </Button>
                        <Button variant="hero" onClick={downloadMeme}>
                          <Download className="w-4 h-4" />
                          Download Meme
                        </Button>
                      </div>
                      
                      {showShareButtons && (
                        <div className="space-y-2">
                          <p className="text-center text-sm text-muted-foreground">
                            Share on social media:
                          </p>
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareMeme("whatsapp")}
                              title="Share on WhatsApp"
                            >
                              <Share2 className="w-4 h-4" />
                              WhatsApp
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareMeme("facebook")}
                              title="Share on Facebook"
                            >
                              <Share2 className="w-4 h-4" />
                              Facebook
                            </Button>
                          </div>
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareMeme("x")}
                              title="Share on X"
                            >
                              <Share2 className="w-4 h-4" />
                              X
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => shareMeme("instagram")}
                              title="Share on Instagram"
                            >
                              <Share2 className="w-4 h-4" />
                              Instagram
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Palette className="w-6 h-6 text-primary" />
                Customize
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topText">Top Text</Label>
                  <Input
                    id="topText"
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="Enter top text"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bottomText">Bottom Text</Label>
                  <Input
                    id="bottomText"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="Enter bottom text"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontSize">
                    Font Size: {fontSize}px
                  </Label>
                  <Slider
                    id="fontSize"
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    min={20}
                    max={100}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    💡 Tip: Classic memes use white text with black outline!
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;