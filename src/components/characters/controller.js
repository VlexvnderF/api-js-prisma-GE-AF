import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (req, res) => {
  try {
  const name = req.query.name;
  const d_birth = req.query.d_birth;
  const movies = req.query.movies;
  let found;
  if(name){
    const characters = await prisma.character.findMany({
      where: {
        name: name,
      },
      select: {
        id: true,
        image: true,
        name: true,
      },
    });
    found = characters
  }
  else if(d_birth){
    const d_birth = parseInt(d_birth)
    const characters = await prisma.character.findMany({
      where: {
        d_birth: d_birth,
      },
      select: {
        id: true,
        image: true,
        name: true,
      },
    });
    found = characters
  }
  else if(movies){
    const id = parseInt(movies)
    const character_movies = await prisma.moviesOnCharacters.findMany(
      {
        where: {
          movieId: id,
        },
        include: {
          character: {
            select: {
            id: true,
            image: true,
            name: true,
          }
        },
        }
      }
    );
    found = character_movies
  }else{
    const characters = await prisma.character.findMany({
      select: {
        id: true,
        image: true,
        name: true,
      },
    });
    found = characters
  }

  
  res.json({
    ok: true,
    data: found,
  });
  } catch (error) {
    res.json({
      ok: false,
      data: error.message,
    });
  }
};

export const detail = async (req, res) => {
  try {
    
    const id = parseInt(req.params.id)

    const detail_character = await prisma.character.findMany(
      {
        where: {
          id: id,
        },
        include: {
          movies: {
            where: {
              characterId: id,
            },
            include: {
              movie: true,
            }
          }
        }
      }
    )
    
    
  res.json({
      ok: true,
      data: {
        personaje: detail_character,
      },
    });
  } catch (error) {
    res.json({
      ok: false,
      data: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const { body } = req;
    const user = await prisma.character.create({
      data: {
        ...body,
      },
    });
    res.json({
      ok: true,
      data: user,
    });
  } catch (error) {
    res.json({
      ok: false,
      data: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { body } = req;
    body.id = id;
    const updateCharacter = await prisma.character.update({
      where: {
        id: id,
      },
      data: {
        ...body
      },
    })

    res.json({
      ok: true,
      data: updateCharacter,
    });
  } catch (error) {
    res.json({
      ok: false,
      data: error.message,
    });
  }

};


export const deleteById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
  
    const deleteCharacter = await prisma.character.delete({
      where: {
        id: id,
      }
    })

    res.json({
      ok: true,
      data: deleteCharacter,
    });
  } catch (error) {
    res.json({
      ok: false,
      data: error.message,
    });
  }
};