// Middleware para verificar roles de usuario
export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        // Verificar que el usuario esté autenticado (debe ejecutarse después de authMiddleware)
        if (!req.user) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        // Verificar que el usuario tenga un rol válido
        if (!req.user.role) {
            return res.status(403).json({ message: "Rol de usuario no definido" });
        }

        // Verificar que el rol del usuario esté en la lista de roles permitidos
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}` 
            });
        }

        next();
    };
}

// Middlewares específicos para roles comunes
export const requireAdmin = requireRole("admin");
export const requireSupervisor = requireRole("admin", "supervisor");
export const requireCollaborator = requireRole("admin", "supervisor", "collaborator");
