import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function WhyWeAsk() {
  return (
    <div className="mt-8 rounded-xl border border-border/60 bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">About this matcher</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The ⓘ icons next to each question explain why we ask it. Below are the bigger-picture details
        about how matching works and how your inputs are used.
      </p>

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="how-it-works">
          <AccordionTrigger>How matching works</AccordionTrigger>
          <AccordionContent>
            We combine your selections with the church directory to generate a short list of recommendations.
            We also generate “why this match” explanations so you can understand what drove each suggestion.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="privacy">
          <AccordionTrigger>Privacy & data use</AccordionTrigger>
          <AccordionContent>
            Your answers are used only to generate your matches. We don’t sell or share your inputs.
            You can always browse churches without using the matcher.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
