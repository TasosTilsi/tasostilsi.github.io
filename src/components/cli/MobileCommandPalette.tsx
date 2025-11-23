import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Terminal, User, Briefcase, GraduationCap, Code, FileText, Mail, Gamepad2, Menu, Sparkles, Eraser, Award, BookOpen, Presentation, Palette, Keyboard, ListTree, ArrowLeft } from "lucide-react";
import { useCliTheme } from '@/components/cli/hooks/useCliTheme';

interface MobileCommandPaletteProps {
    onExecuteCommand: (command: string) => void;
}

interface CommandItem {
    cmd: string;
    icon: React.ReactElement;
    label: string;
    isTheme?: boolean;
}

export const MobileCommandPalette: React.FC<MobileCommandPaletteProps> = ({ onExecuteCommand }) => {
    const [open, setOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showThemes, setShowThemes] = useState(false);
    const { VALID_THEMES, currentTheme } = useCliTheme();

    const basicCommands: CommandItem[] = [
        { cmd: "about", icon: <User className="w-4 h-4" />, label: "About" },
        { cmd: "contact", icon: <Mail className="w-4 h-4" />, label: "Contact" },
        { cmd: "experience", icon: <Briefcase className="w-4 h-4" />, label: "Experience" },
        { cmd: "education", icon: <GraduationCap className="w-4 h-4" />, label: "Education" },
        { cmd: "skills", icon: <Terminal className="w-4 h-4" />, label: "Skills" },
        { cmd: "clear", icon: <Eraser className="w-4 h-4" />, label: "Clear" },
    ];

    const advancedCommands: CommandItem[] = [
        { cmd: "resume", icon: <FileText className="w-4 h-4" />, label: "Resume" },
        { cmd: "projects", icon: <Code className="w-4 h-4" />, label: "Projects" },
        { cmd: "articles", icon: <BookOpen className="w-4 h-4" />, label: "Articles" },
        { cmd: "certs", icon: <Award className="w-4 h-4" />, label: "Certifications" },
        { cmd: "presentations", icon: <Presentation className="w-4 h-4" />, label: "Presentations" },
        { cmd: "games", icon: <Gamepad2 className="w-4 h-4" />, label: "Games" },
        { cmd: "theme", icon: <Palette className="w-4 h-4" />, label: "Theme", isTheme: true },
        { cmd: "shortcuts", icon: <Keyboard className="w-4 h-4" />, label: "Shortcuts" },
        { cmd: "achievements", icon: <Sparkles className="w-4 h-4" />, label: "Achievements" },
        { cmd: "alias", icon: <ListTree className="w-4 h-4" />, label: "Aliases" },
    ];

    const handleCommand = (cmd: string) => {
        onExecuteCommand(cmd);
        setOpen(false);
        setShowAdvanced(false);
        setShowThemes(false);
    };

    const handleThemeClick = () => {
        setShowThemes(true);
    };

    const handleThemeSelect = (theme: string) => {
        onExecuteCommand(`theme ${theme}`);
        setOpen(false);
        setShowAdvanced(false);
        setShowThemes(false);
    };

    const toggleAdvanced = () => {
        setShowAdvanced(!showAdvanced);
        setShowThemes(false);
    };

    const backToAdvanced = () => {
        setShowThemes(false);
    };

    const displayCommands = showAdvanced ? advancedCommands : basicCommands;

    return (
        <div className="md:hidden fixed bottom-6 right-6 z-50">
            <Sheet open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                    setShowAdvanced(false);
                    setShowThemes(false);
                }
            }}>
                <SheetTrigger asChild>
                    <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-accent/20">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-xl border-t border-accent/20 bg-background/95 backdrop-blur">
                    <SheetHeader className="mb-4">
                        <SheetTitle className="text-left text-accent font-mono">
                            {showThemes ? "Select Theme" : showAdvanced ? "Advanced Commands" : "Command Palette"}
                        </SheetTitle>
                    </SheetHeader>

                    {showThemes ? (
                        <div className="grid grid-cols-2 gap-3 pb-6">
                            {VALID_THEMES.map((theme) => (
                                <Button
                                    key={theme}
                                    variant={currentTheme === theme ? "default" : "outline"}
                                    className={`justify-start h-12 transition-colors ${currentTheme === theme
                                        ? "bg-accent text-accent-foreground"
                                        : "border-accent/20 hover:bg-accent/10 hover:text-accent"
                                        }`}
                                    onClick={() => handleThemeSelect(theme)}
                                >
                                    <span className="mr-3">
                                        <Palette className="w-4 h-4" />
                                    </span>
                                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                className="justify-start h-12 border-accent/20 hover:bg-accent/10 hover:text-accent transition-colors col-span-2"
                                onClick={backToAdvanced}
                            >
                                <span className="mr-3 text-accent"><ArrowLeft className="w-4 h-4" /></span>
                                Back to Advanced
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 pb-6">
                            {displayCommands.map((item) => (
                                <Button
                                    key={item.cmd}
                                    variant="outline"
                                    className="justify-start h-12 border-accent/20 hover:bg-accent/10 hover:text-accent transition-colors"
                                    onClick={() => item.isTheme ? handleThemeClick() : handleCommand(item.cmd)}
                                >
                                    <span className="mr-3 text-accent">{item.icon}</span>
                                    {item.label}
                                </Button>
                            ))}
                            {!showAdvanced && (
                                <Button
                                    variant="outline"
                                    className="justify-start h-12 border-accent/20 hover:bg-accent/10 hover:text-accent transition-colors col-span-2"
                                    onClick={toggleAdvanced}
                                >
                                    <span className="mr-3 text-accent"><Sparkles className="w-4 h-4" /></span>
                                    Advanced
                                </Button>
                            )}
                            {showAdvanced && (
                                <Button
                                    variant="outline"
                                    className="justify-start h-12 border-accent/20 hover:bg-accent/10 hover:text-accent transition-colors col-span-2"
                                    onClick={toggleAdvanced}
                                >
                                    <span className="mr-3 text-accent"><Terminal className="w-4 h-4" /></span>
                                    Back to Basic
                                </Button>
                            )}
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
};
