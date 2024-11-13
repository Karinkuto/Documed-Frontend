import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Smile } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
}

interface AnnouncementCommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  isExpanded: boolean;
}

export function AnnouncementComments({ comments, onAddComment, isExpanded }: AnnouncementCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [textareaFocused, setTextareaFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  const addEmoji = (emoji: any) => {
    setNewComment(prev => prev + emoji.native);
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-gray-200"
        >
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 group"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.author.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                      {comment.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className={cn(
                "relative rounded-md border",
                textareaFocused && "ring-2 ring-[#7EC143] border-[#7EC143]"
              )}>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onFocus={() => setTextareaFocused(true)}
                  onBlur={() => setTextareaFocused(false)}
                  placeholder="Write a comment..."
                  className="min-h-[100px] resize-none border-none focus-visible:ring-0"
                />
                <div className="absolute bottom-2 right-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <Smile className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-full p-0 border-none" 
                      side="top" 
                      align="end"
                    >
                      <Picker
                        data={data}
                        onEmojiSelect={addEmoji}
                        theme="light"
                        previewPosition="none"
                        skinTonePosition="none"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#7EC143] hover:bg-[#7EC143]/90"
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 