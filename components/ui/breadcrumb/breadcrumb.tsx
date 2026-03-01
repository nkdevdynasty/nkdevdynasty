import React from "react";
import { ChevronRight } from "lucide-react";

export const Breadcrumb = ({ children }: { children: React.ReactNode }) => {
  return <nav>{children}</nav>;
};

export const BreadcrumbList = ({ children }: { children: React.ReactNode }) => {
  return <ol className="flex items-center gap-2 text-sm">{children}</ol>;
};

export const BreadcrumbItem = ({ children }: { children: React.ReactNode }) => {
  return <li className="flex items-center gap-2">{children}</li>;
};

export const BreadcrumbLink = ({ children }: { children: React.ReactNode }) => {
  return <span className="hover:underline cursor-pointer">{children}</span>;
};

export const BreadcrumbPage = ({ children }: { children: React.ReactNode }) => {
  return <span className="font-semibold">{children}</span>;
};

export const BreadcrumbSeparator = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return <span>{children ?? <ChevronRight className="h-4 w-4" />}</span>;
};