"use client";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useState } from "react";
import { Button } from "./ui/button";

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

const TestDialog = () => {
	const [open, setOpen] = useState(false);

	return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <form onSubmit={(event) => {
                            console.log("Deleting contact");
							wait().then(() => setOpen(false));
							event.preventDefault();
						}}>
              <Button variant={"destructive"} type="submit">Delete Contact</Button>
            </form>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
	);
};

export default TestDialog;