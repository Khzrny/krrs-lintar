"use client";

import { Button, IconPrinter } from "@/components/ui";

export function TombolCetak() {
  return (
    <Button variant="gold" onClick={() => window.print()}>
      <IconPrinter className="size-4" /> Cetak / Simpan PDF
    </Button>
  );
}
