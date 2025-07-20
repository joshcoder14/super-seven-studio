import React from "react";
import { NotFound } from '@/components/notFound';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Not Found | Super Seven Studio",
    description: "Super Seven Studio",
};

export default function NotFoundPage() {
    return <NotFound />;
}