"use client";

import React from "react";
import CommonLayout from "../components/CommonLayout";

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
