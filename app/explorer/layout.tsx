"use client";

import CommonLayout from "@/app/components/CommonLayout";
import React from "react";

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommonLayout
      showBackButton={true}
      backButtonLabel="Back to Vaults"
      backButtonPath="/vaults"
    >
      {children}
    </CommonLayout>
  );
}
