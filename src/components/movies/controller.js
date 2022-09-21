import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (req, res) => {

  try {
    const name = req.query.name;
    const gender = req.query.gender;
    const order = req.query.order;
    let found;
    if(name){
      const movies = await prisma.movie.findMany({
        where: {
          name: name,
        },
        select: {
          id: true,
          name: true,
          image: true,
          fecha_ini: true,
        },
      });
      found = movies
    }
    else if(gender){
      const gender = parseInt(gender)
      const movies = await prisma.gendersOnMovies.findMany({
        where: {
          genderId: gender,
        },
        include: {
          movie: true
        },
      });
      found = movies
    }
    else if(order){
      const character_movie = await prisma.movie.findMany(
        {
          orderBy: {
            createdAt: order,
            /* createdAt: 'asc', */
            /* createdAt: 'desc', */
          },
        }
      );
      found = character_movie
    }else{
      const movies = await prisma.movie.findMany({
        select: {
          id: true,
          image: true,
          name: true,
          fecha_ini: true,
        },
      });
      found = movies
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

    let movie_found;

    const movies_characters = await prisma.moviesOnCharacters.findMany(
      {
        where: {
          movieId: id,
        },
        include: {
          movie: true,
          character: true, 
        }
      }
    );

    if(movies_characters.length >= 1){
      movie_found = movies_characters;
    }else{

      const movie = await prisma.movie.findMany({
        where: {
          id: id,
        },
        include:{
          characters: true
        }
      });


      movie_found = movie;
    }

    res.json({
      ok: true,
      data: {
        movie: movie_found,
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
    const user = await prisma.movie.create({
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
    const updatePelicula  = await prisma.movie.update({
      where: {
        id: id,
      },
      data: {
        ...body
      },
    })

    res.json({
      ok: true,
      data: updatePelicula ,
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
  
    const deleteMovie  = await prisma.movie.delete({
      where: {
        id: id,
      }
    })

    res.json({
      ok: true,
      data: deleteMovie ,
    });
  } catch (error) {
    res.json({
      ok: false,
      data: error.message,
    });
  }
};