import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { PerformanceStressTest } from './PerformanceStressTest';

interface PerformanceTestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PerformanceTestModal({ open, onOpenChange }: PerformanceTestModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Performance & Stress Testing</DialogTitle>
          <DialogDescription>
            Test system performance, database speed, and concurrent user handling
          </DialogDescription>
        </DialogHeader>
        <PerformanceStressTest />
      </DialogContent>
    </Dialog>
  );
}