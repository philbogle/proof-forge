// src/components/proof-explorer/advanced-settings.tsx
import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle, Trash2, History, RefreshCw } from 'lucide-react';
import type { Theorem, ProofVersion, User } from '@/lib/types';
import { Switch } from '../ui/switch';

interface AdvancedSettingsProps {
  user: User | null;
  isProofLoading: boolean;
  generateNewProof: (forceRefresh?: boolean) => void;
  selectedTheorem: Theorem;
  handleClearCache: () => void;
  currentProofHistory: ProofVersion[];
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
  handleRollback: () => void;
  renderMarkdown: boolean;
  setRenderMarkdown: (value: boolean) => void;
}

export default function AdvancedSettings({
  user,
  isProofLoading,
  generateNewProof,
  selectedTheorem,
  handleClearCache,
  currentProofHistory,
  selectedVersion,
  setSelectedVersion,
  handleRollback,
  renderMarkdown,
  setRenderMarkdown,
}: AdvancedSettingsProps) {
  const latestVersion = currentProofHistory[0];

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="advanced-settings">
        <AccordionTrigger>
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertCircle className="h-4 w-4" />
            Advanced Settings
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="space-y-6 pt-6">
               {latestVersion && !isProofLoading && (
                 <div className="text-sm">
                    <span>
                      Last updated
                      {latestVersion.user?.name && ` by ${latestVersion.user.name}`}
                      {' on '}
                      {new Date(latestVersion.timestamp).toLocaleDateString()}
                    </span>
                 </div>
                )}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-semibold">Raw Markdown Editor</h4>
                  <p className="text-sm text-muted-foreground">
                    View and edit the raw Markdown source of the proof.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="markdown-toggle"
                    className="text-sm font-medium"
                  >
                    Rendered
                  </Label>
                  <Switch
                    id="markdown-toggle"
                    checked={renderMarkdown}
                    onCheckedChange={setRenderMarkdown}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Refresh and Regenerate Proof</h4>
                <p className="text-sm text-muted-foreground">
                  Force a new proof to be generated, ignoring the current cache.
                  This will be attributed to you.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => generateNewProof(true)}
                  disabled={isProofLoading}
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${
                      isProofLoading ? 'animate-spin' : ''
                    }`}
                  />
                  {isProofLoading ? 'Refreshing...' : 'Refresh Proof'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Clear Theorem Cache</h4>
                  <p className="text-sm text-muted-foreground">
                    Delete all cached proofs for "{selectedTheorem.name}" and
                    regenerate.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleClearCache}
                  size="sm"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Proof Version History</h4>
                    <p className="text-sm text-muted-foreground">
                      Rollback to a previous version of the proof for the current
                      formality level.
                    </p>
                  </div>
                </div>
                {currentProofHistory.length > 0 ? (
                  <div className="flex items-end gap-2">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="version-select">Select Version</Label>
                      <Select
                        onValueChange={setSelectedVersion}
                        value={selectedVersion}
                      >
                        <SelectTrigger id="version-select">
                          <SelectValue placeholder="Select a version to restore" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentProofHistory.map((version) => (
                            <SelectItem
                              key={version.timestamp}
                              value={version.timestamp}
                            >
                              {new Date(
                                version.timestamp
                              ).toLocaleString()}{' '}
                              {version.user?.name && `by ${version.user.name}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleRollback} disabled={!selectedVersion}>
                      <History className="mr-2 h-4 w-4" />
                      Rollback
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No history available for this proof and formality level.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
