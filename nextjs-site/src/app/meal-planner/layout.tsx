import { LayoutClient } from './layout-client';

export default function MealPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutClient>{children}</LayoutClient>;
}
