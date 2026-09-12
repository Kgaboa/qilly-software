import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { UIAutomationTester } from './UIAutomationTester';

interface UIAutomationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UIAutomationModal({ open, onOpenChange }: UIAutomationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>UI Automation & Regression Testing</DialogTitle>
          <DialogDescription>
            Automated testing of critical user flows to catch bugs before deployment
          </DialogDescription>
        </DialogHeader>
        <UIAutomationTester />
      </DialogContent>
    </Dialog>
  );
}