"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

export interface UniversalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    iframeUrl: string;
    sourceUrl?: string;
    externalUrl: string;
    footerButtons?: React.ReactNode;
}

const UniversalModal: React.FC<UniversalModalProps & { children?: React.ReactNode, contentClassName?: string }> = ({
    isOpen,
    onClose,
    title,
    description,
    iframeUrl,
    sourceUrl,
    externalUrl,
    footerButtons,
    children,
    contentClassName,
}) => {
    if (!isOpen) {
        return null;
    }

    const handleOpenExternal = () => {
        if (externalUrl) {
            window.open(externalUrl, "_blank", "noopener,noreferrer");
        }
    };

    const handleOpenSource = () => {
        if (sourceUrl) {
            window.open(sourceUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`max-w-6xl w-full h-[90vh] flex flex-col p-0 ${contentClassName || ""}`}>
                <DialogHeader className="p-6 pb-2 print-hidden">
                    <DialogTitle className="text-2xl">{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-grow flex flex-col overflow-hidden px-6 print:overflow-visible print:h-auto print:px-0">
                    {children ? (
                        children
                    ) : (
                        iframeUrl && (
                            <iframe
                                src={iframeUrl}
                                title={title}
                                className="w-full h-full border-0 rounded-lg"
                                allowFullScreen
                            />
                        )
                    )}
                </div>

                <DialogFooter className="p-6 pt-2 border-t print-hidden">
                    {footerButtons ? (
                        <>
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                            {footerButtons}
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                            {sourceUrl && (
                                <Button variant="outline" onClick={handleOpenSource}>
                                    <i className="fab fa-github mr-2" aria-hidden="true"></i>Source
                                </Button>
                            )}
                            {externalUrl && (
                                <Button onClick={handleOpenExternal}>
                                    <i className="fas fa-external-link-alt mr-2" aria-hidden="true"></i>Open Full Screen
                                </Button>
                            )}
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UniversalModal;
