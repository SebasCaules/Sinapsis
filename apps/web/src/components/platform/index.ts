/**
 * Componentes de PLATAFORMA compartidos por la landing y el shell de materia.
 * Dueño: agente C. El agente D solo los consume. Firmas estables:
 *
 *  <Seal size={34} />                      sello «S» (círculo primary, aro accent, S itálica)
 *  <ThemeToggle />                         botón que cicla pergamino → laurel → claustro (persiste en /me y localStorage)
 *  <AvatarMenu />                          avatar con iniciales + menú (nombre, correo, cerrar sesión)
 *  <SearchButton onClick label hint />     botón-buscador con chip ⌘K
 *  <Button variant="primary|secondary|ghost" size="sm|md" />
 *  <IconButton label> children </IconButton>
 *  <Dialog open onClose title eyebrow> children </Dialog>
 *  <Field label ... /> <SelectField label options />
 *  useToast() → { toast(msg) }  y  <Toaster />
 */
export * from "./Icon";
export * from "./Seal";
export * from "./ThemeToggle";
export * from "./AvatarMenu";
export * from "./SearchButton";
export * from "./Button";
export * from "./Dialog";
export * from "./Field";
export * from "./Toast";
