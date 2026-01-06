import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function WhyWeAsk() {
  return (
    <div className="mt-8 rounded-xl border border-border/60 bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Why we ask these questions</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        We use your answers to narrow down local options and explain our recommendations. We don’t sell or share your inputs.
      </p>

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="denomination">
          <AccordionTrigger>Denomination (optional)</AccordionTrigger>
          <AccordionContent>
            If you have a tradition you already identify with, this helps us prioritize churches that align with it. If you’re not sure,
            choose “No preference” — we’ll focus on other signals.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger>Church size</AccordionTrigger>
          <AccordionContent>
            Size often affects what the experience feels like — from the worship setting to how easy it is to meet people. We use this to
            find communities that match your comfort level.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            We focus on churches in and around State College. Location helps us recommend options that are realistically convenient so it’s
            easier to visit and stay connected.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="additional">
          <AccordionTrigger>Additional information (optional)</AccordionTrigger>
          <AccordionContent>
            This is your space to share what matters most right now (for example: campus ministry, kids programs, service opportunities,
            accessibility needs, or worship style). It helps the recommendations feel more personal and the “why” more specific.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="privacy">
          <AccordionTrigger>Privacy & data use</AccordionTrigger>
          <AccordionContent>
            Your answers are used only to generate your matches. We don’t publish your inputs, and you can always browse churches without
            using the matcher.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
