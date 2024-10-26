import { EditorBubbleItem, useEditor } from "novel"

import { cn } from "@nexcom/ui/lib/utils"
import { Button } from "@nexcom/ui/components/button"

import type { SelectorItem } from "./node-selector"
import { Bold, Code, Italic, Strikethrough, Underline } from "lucide-react"

export const TextButtons = () => {
  const { editor } = useEditor()
  if (!editor) return null

  const items: SelectorItem[] = [
    {
      name: "bold",
      isActive: (editor) => editor.isActive("bold"),
      command: (editor) => editor.chain().focus().toggleBold().run(),
      icon: Bold,
    },
    {
      name: "italic",
      isActive: (editor) => editor.isActive("italic"),
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      icon: Italic,
    },
    {
      name: "underline",
      isActive: (editor) => editor.isActive("underline"),
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      icon: Underline,
    },
    {
      name: "strike",
      isActive: (editor) => editor.isActive("strike"),
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      icon: Strikethrough,
    },
    {
      name: "code",
      isActive: (editor) => editor.isActive("code"),
      command: (editor) => editor.chain().focus().toggleCode().run(),
      icon: Code,
    },
  ]

  return (
    <div className="flex">
      {items.map((item, index) => (
        <EditorBubbleItem
          key={index}
          onSelect={(editor) => {
            item.command(editor)
          }}
        >
          <Button
            type="button"
            size="sm"
            className="rounded-none"
            variant="ghost"
          >
            <item.icon
              className={cn("size-4", {
                "text-blue-500": item.isActive(editor),
              })}
            />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  )
}
