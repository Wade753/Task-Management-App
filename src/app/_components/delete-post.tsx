import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DeletePostModal = ({
    postTitle,
    onDelete,
    children, // Adăugăm children ca prop
}: {
    postTitle: string;
    onDelete: () => void;
    children: React.ReactNode; // Specificăm tipul pentru children
}) => {
    const [inputValue, setInputValue] = useState("");
    const isMatch = inputValue.trim() === postTitle.trim();

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
                    <DialogDescription>
                        If you are sure you want to delete the post "{postTitle}", type its title below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="confirm" className="text-right">
                            Confirm
                        </Label>
                        <Input
                            id="confirm"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter post title"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setInputValue("")}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (isMatch) onDelete();
                        }}
                        disabled={!isMatch}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export {DeletePostModal};

