'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { Check, MoveRight } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { contact } from '../actions/contact';

export const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = `${formData.get('firstname')} ${formData.get('lastname')}`;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    toast.promise(contact(name, email, message), {
      loading: 'Sending your message...',
      success: () => {
        (event.target as HTMLFormElement).reset();
        setIsLoading(false);
        return "Message sent successfully! We'll get back to you soon.";
      },
      error: (err) => {
        setIsLoading(false);
        return err instanceof Error ? err.message : 'Failed to send message';
      },
    });
  }

  return (
    <section className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
      <div className="grid gap-16 md:grid-cols-2 md:gap-24">
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="font-semibold text-3xl tracking-tight md:text-4xl">
              Let's talk about feedback
            </h1>
            <p className="text-lg text-muted-foreground">
              Want to learn more about how Feedbackthing can help improve your
              product? Get in touch!
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Streamline Feedback Collection</p>
                <p className="text-muted-foreground text-sm">
                  Easily centralize and organize feedback from your users in one
                  place
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Turn Insights into Action</p>
                <p className="text-muted-foreground text-sm">
                  Identify trends and prioritize features based on real user
                  needs.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Collaborative Discussions</p>
                <p className="text-muted-foreground text-sm">
                  Enable meaningful conversations with your users through
                  changelogs and feedback boards.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={onSubmit} className="space-y-6 rounded-lg border p-8">
            <div className="space-y-4">
              <h2 className="font-semibold text-xl">Contact us</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First name</Label>
                  <Input id="firstname" name="firstname" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Last name</Label>
                  <Input id="lastname" name="lastname" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us how we can help..."
                />
              </div>
            </div>

            <Button className="w-full gap-2" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send message'}
              <MoveRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
