"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import Image from "next/image";

import Cancel from "@/assets/cancel.svg";

type Props = {
  title: string;
  aside?: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

export default function Dialog({ title, aside, children, closeModal }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", close);

    return () => {
      window.removeEventListener("keydown", close);
    };
  }, [closeModal]);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeDialog = () => {
    dialogRef.current?.close();
    closeModal();
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className={cn("modal visible opacity-100 ", {
        "sm:justify-end align-bottom": aside,
      })}
    >
      <section
        className={cn("modal-box bg-secondary text-primary m-0", {
          "rounded-xl w-full max-w-[700px] p-8": !aside,
          "h-screen max-h-[calc(100vh)] border-b-raius rounded-none sm:rounded-tr-xl sm:rounded-tl-xl w-full sm:w-[369px] sm:mr-3 sm:mt-4":
            aside,
        })}
      >
        <div className="flex justify-between items-center">
          <Image
            src={Cancel}
            alt="Close"
            onClick={closeDialog}
            className={cn("cursor-pointer opacity-0", {
              "opacity-100": aside,
            })}
          />
          <h4>{title}</h4>
          <Image
            src={Cancel}
            alt="Close"
            onClick={closeDialog}
            className={cn("cursor-pointer", {
              "opacity-0": aside,
            })}
          />
        </div>

        {children}
      </section>
    </dialog>
  );
}
