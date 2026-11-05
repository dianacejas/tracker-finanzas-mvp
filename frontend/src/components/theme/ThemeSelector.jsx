import { Moon, Palette, Sun, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

export default function ThemeSelector() {
  const { mode, toggleMode, palette, setPalette, palettes } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleMode}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--color-foreground)] transition-colors hover:bg-[color:var(--bg-input)]"
        aria-label="Cambiar modo claro/oscuro"
      >
        {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </motion.button>

      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button
            aria-label="Seleccionar tema de color"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--color-foreground)] transition-colors hover:bg-[color:var(--bg-input)]"
          >
            <Palette className="h-5 w-5" />
          </button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Paletas de colores"
          className="min-w-[170px] gap-1 rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--bg-surface)] p-1.5 shadow-xl"
        >
          {palettes.map((p) => {
            const isSelected = palette === p.id;
            return (
              <DropdownItem
                key={p.id}
                onClick={() => setPalette(p.id)}
                textValue={p.id}
                className={`rounded-xl px-2.5 py-2 transition-all cursor-pointer ${
                  isSelected ? "bg-[color:var(--bg-input)] font-medium" : "hover:bg-[color:var(--bg-input)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {(p.colors || []).map((hex, i) => (
                      <span
                        key={i}
                        className="h-4 w-4 shrink-0 rounded-full border border-black/10 dark:border-white/10"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-[color:var(--brand-primary)]" />}
                </div>
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
