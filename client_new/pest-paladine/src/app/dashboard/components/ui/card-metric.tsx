import { DivideIcon as LucideIcon } from "lucide-react";
import { Card, CardContent } from "./card";

interface CardMetricProps {
  icon: LucideIcon;
  title: string;
  value: string;
}

export function CardMetric({ icon: Icon, title, value }: CardMetricProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className="rounded-full bg-green-100 p-3">
          <Icon className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}