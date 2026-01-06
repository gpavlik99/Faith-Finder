import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  comments: z.string().trim().min(1, "Comments are required").max(1000, "Comments must be less than 1000 characters"),
});

export default function ContactUs() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comments: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      contactSchema.parse(formData);
      setIsSubmitting(true);

      // TODO: send to your backend (email, CRM, etc.)
      await new Promise((resolve) => setTimeout(resolve, 900));

      toast({
        title: "Message sent",
        description: "Thanks for reaching out. We’ll get back to you soon.",
      });

      setFormData({ name: "", email: "", comments: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Please check your message",
          description: error.errors[0]?.message ?? "Invalid form",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Could not send message",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
              <Mail className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-accent-foreground">Contact</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Get in touch</h1>
            <p className="mt-3 text-muted-foreground">
              Questions, feedback, or church updates? Send us a note.
            </p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Message</CardTitle>
              <CardDescription>
                We read every message. If you’re a church leader and want to update your listing, mention your church name and website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    rows={6}
                    className="resize-none"
                    value={formData.comments}
                    onChange={(e) => setFormData((p) => ({ ...p, comments: e.target.value }))}
                    placeholder="How can we help?"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-spiritual hover:opacity-95"
                >
                  {isSubmitting ? (
                    "Sending…"
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send message
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
