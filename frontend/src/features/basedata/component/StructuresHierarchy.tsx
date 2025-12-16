"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import Tree, { RawNodeDatum } from "react-d3-tree";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { shortenText } from "@/utils/shortenText";
import { StructureNode } from "@/redux/types/structureNode";

/* -----------------------------
 Types
----------------------------- */

interface D3TreeNode {
  name: string;
  attributes: {
    structure_node_id: string;
    description?: string;
    parent_id?: string | null;
    level?: number;
    is_active: boolean;
  };
  children?: D3TreeNode[];
}

/* -----------------------------
 Recursive converter
----------------------------- */

function convertToD3Tree(node: StructureNode): D3TreeNode {
  return {
    name: node.name || "Unnamed",
    attributes: {
      structure_node_id: node.structure_node_id,
      description: node.description || "",
      parent_id: node.parent_id ?? null,
      level: node.level,
      is_active: node.is_active,
    },
    children: node.children?.length
      ? node.children.map(convertToD3Tree)
      : undefined,
  };
}

/* -----------------------------
 Custom Node UI
----------------------------- */

interface CustomNodeProps {
  nodeDatum: D3TreeNode & { __rd3t?: { collapsed?: boolean } };
  toggleNode: () => void;
}

const CustomNode: React.FC<CustomNodeProps> = ({
  nodeDatum,
  toggleNode,
}) => {
  const hasChildren = !!nodeDatum.children?.length;
  const collapsed = nodeDatum.__rd3t?.collapsed ?? false;

  return (
    <g>
      {/* Expand / Collapse */}
      {hasChildren && (
        <g transform="translate(-160,-70)">
          <foreignObject width={24} height={24}>
            <button
              onClick={toggleNode}
              className="w-6 h-6 rounded-full bg-[#094C81] text-white font-bold flex items-center justify-center hover:bg-[#073954]"
            >
              {collapsed ? "+" : "−"}
            </button>
          </foreignObject>
        </g>
      )}

      {/* Card */}
      <foreignObject x={-150} y={-90} width={300} height={170}>
        <div className="bg-white rounded-2xl border shadow-lg hover:shadow-xl transition p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-[#094C81] font-semibold text-sm line-clamp-2">
              {nodeDatum.name}
            </h3>

            <span
              className={`text-xs px-2 py-1 rounded-full ${
                nodeDatum.attributes.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {nodeDatum.attributes.is_active ? "Active" : "Inactive"}
            </span>
          </div>

          {nodeDatum.attributes.description && (
            <p className="text-xs text-gray-600 mt-2 text-center">
              {shortenText(nodeDatum.attributes.description, 30)}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-[#094C81] hover:bg-[#073954] text-white text-xs font-semibold py-2 rounded-lg">
              Details
            </button>
            <button className="flex-1 bg-[#094C81] hover:bg-[#073954] text-white text-xs font-semibold py-2 rounded-lg">
              Add Child
            </button>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

/* -----------------------------
 Main Component
----------------------------- */

interface HierarchyD3TreeProps {
  data: StructureNode[];
  isLoading?: boolean;
}

const HierarchyD3Tree: React.FC<HierarchyD3TreeProps> = ({
  data,
  isLoading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [selectedRootId, setSelectedRootId] = useState("");

  /* -----------------------------
   Roots only
  ----------------------------- */

  const rootNodes = useMemo(
    () => data.filter((n) => n.parent_id === null),
    [data]
  );

  const d3TreeData = useMemo(
    () => rootNodes.map(convertToD3Tree),
    [rootNodes]
  );

  const rootOptions = rootNodes.map((n) => ({
    value: n.structure_node_id,
    label: n.name,
  }));

  /* -----------------------------
   Default root
  ----------------------------- */

  useEffect(() => {
    if (!selectedRootId && rootOptions.length) {
      setTimeout(() => {
        setSelectedRootId(rootOptions[0].value);
      }, 0);
    }
  }, [rootOptions, selectedRootId]);

  const selectedTree = useMemo(() => {
    const node = d3TreeData.find(
      (n) => n.attributes.structure_node_id === selectedRootId
    );
    return node ? [node] : null;
  }, [d3TreeData, selectedRootId]);

  /* -----------------------------
   Resize & fullscreen
  ----------------------------- */

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 6 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* -----------------------------
   States
  ----------------------------- */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!d3TreeData.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        No hierarchy nodes found
      </div>
    );
  }

  /* -----------------------------
   Render
  ----------------------------- */

  return (
    <div className="space-y-4">
      {rootOptions.length > 1 && (
        <div className="w-[300px]">
          <Label>Select Root Node</Label>
          <Select value={selectedRootId} onValueChange={setSelectedRootId}>
            <SelectTrigger>
              <SelectValue placeholder="Select root node" />
            </SelectTrigger>
            <SelectContent>
              {rootOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-screen bg-[#F9FBFC] border rounded-lg overflow-hidden"
      >
        {selectedTree && (
          <Tree
            data={selectedTree as unknown as RawNodeDatum[]}
            translate={translate}
            orientation="vertical"
            pathFunc="straight"
            nodeSize={{ x: 220, y: 260 }}
            zoom={0.75}
            scaleExtent={{ min: 0.3, max: 1.5 }}
            renderCustomNodeElement={(props) => (
              <CustomNode
                nodeDatum={
                  props.nodeDatum as unknown as D3TreeNode & {
                    __rd3t?: { collapsed?: boolean };
                  }
                }
                toggleNode={props.toggleNode}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};

export default HierarchyD3Tree;
