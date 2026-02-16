"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SentFilesTab } from "./sent-files-tab";
import {ReceivedFilesTab} from "./received-files-tab";
import { Upload, Download } from "lucide-react";

export function FileTabs() {
  return (
    <Tabs defaultValue="sent" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sent" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Sent Files
        </TabsTrigger>
        <TabsTrigger value="received" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Received Files
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sent" className="mt-6">
        <SentFilesTab />
      </TabsContent>
      <TabsContent value="received" className="mt-6">
        <ReceivedFilesTab />
      </TabsContent>
    </Tabs>
  );
}
