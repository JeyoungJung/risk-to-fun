import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Activities - Risk to Fun",
  description: "Compare the Fun Score, Risk Score, and WorthIt metrics of different activities side-by-side.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}