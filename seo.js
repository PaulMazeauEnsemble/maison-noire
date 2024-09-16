

export const domain = process.env.NODE_ENV === "development" ? "http://localhost:3000" :
                process.env.NODE_ENV === "staging" ? "https://maison-noire.vercel.app" :
                process.env.NODE_ENV === "production" ? "https://lamaisonnoire.fr" : "https://lamaisonnoire.fr"

              
export const metas = {
  description: 'Plus de 30 créatif.ve.s et technicien.ne.s, réuni.e.s sous le même toit, pour proposer : conception & direction artistique, réalisation, production, post-production.',
  title: 'LA MAISON NOIRE',
  preview: `${domain}/preview.jpg`,
}