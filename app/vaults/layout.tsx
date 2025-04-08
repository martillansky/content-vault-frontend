"use client";

import React from "react";
import CommonLayout from "../components/CommonLayout";

export default function VaultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommonLayout showBackButton={false}>{children}</CommonLayout>;
}
