import Usuario from "../entities/Usuario";
import IUsuario from "../interface/IUsuario";
import { AppDataSource } from "../../database/data-source";

const usuarioRepository = AppDataSource.getRepository(Usuario);

const getUsuarios = (): Promise<IUsuario[]> => {
  return usuarioRepository.find({ order: { id: 'ASC' } });
};

const createUsuario = async (usuario: IUsuario): Promise<IUsuario> => {
  const novoUsuario: Usuario = usuarioRepository.create(usuario);
  return usuarioRepository.save(novoUsuario);
};

const getUsuarioId = async (id: number): Promise<IUsuario | undefined> => {
  const usuario: Usuario | undefined | null = await usuarioRepository.findOne({ where: { id }});
  if (usuario !== null) {
    return {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email
    };
  }
  return undefined;
}

const updateUsuario = async (id: number, usuario: IUsuario): Promise<IUsuario | undefined> => {
  const usuarioExistente: Usuario | null = await usuarioRepository.findOne({ where: { id } });

  if (!usuarioExistente) {
    return undefined;
  }

  await usuarioRepository.update(id, usuario);
  const usuarioAtualizado: Usuario | null = await usuarioRepository.findOne({ where: { id } });
  return usuarioAtualizado ? (usuarioAtualizado as IUsuario) : undefined;
};

const deleteUsuario = async (id: number): Promise<IUsuario | null> => {
  const usuarioExistente: IUsuario | null = await usuarioRepository.findOne({ where: { id } });
  
  if (!usuarioExistente) {
    return null;
  }

  await usuarioRepository.delete(id);
  return usuarioExistente;

};

export default { getUsuarios, createUsuario, updateUsuario, getUsuarioId, deleteUsuario };
