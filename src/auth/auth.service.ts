import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Role } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  // 🔐 LOGIN
  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    // Validaciones de seguridad
    if (!user || !user.enabled || user.locked) {
      throw new UnauthorizedException("Usuario no autorizado");
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException("Credenciales incorrectas");
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role, // ✅ ya viene tipado correctamente
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 🧑‍💻 REGISTER
  async register(data: { username: string; password: string; role?: string }) {
    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      throw new BadRequestException("El usuario ya existe");
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // ✅ Validar role correctamente (esto evita tu error)
    let role: Role = Role.ADMIN; // default

    if (data.role) {
      const roleUpper = data.role.toUpperCase();

      if (Object.values(Role).includes(roleUpper as Role)) {
        role = roleUpper as Role;
      } else {
        throw new BadRequestException("Rol inválido");
      }
    }

    // Crear usuario
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        enabled: true,
        locked: false,
        role: role,
      },
    });

    return {
      message: "Usuario creado correctamente",
      userId: user.id,
    };
  }
}