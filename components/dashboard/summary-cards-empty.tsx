import { Card, CardContent } from "@/components/ui/card";

const SummaryCardsEmpty = () => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    <Card className="col-span-full">
      <CardContent className="py-6">
        <p className="text-center text-muted-foreground">No posts yet. Start creating content to see your analytics!</p>
      </CardContent>
    </Card>
  </div>
);

export { SummaryCardsEmpty };
