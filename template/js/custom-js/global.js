import * as merge from 'lodash.merge'
import EcomSearch from '@ecomplus/search-engine'

/*
 * Multi-frente: a conta (KANTO DO ARTISTA) é compartilhada entre a loja
 * principal e esta frente. Cada produto desta frente carrega a especificação
 * da grade `store` com o texto abaixo; o middleware injeta esse filtro em
 * todas as queries do search-engine no cliente (busca, filtros/facetas,
 * vitrines dinâmicas, recomendados e componentes Vue).
 *
 * O mesmo filtro é registrado no lado SSR em `template/pages/@/meta.ejs`.
 */
const storeSpec = 'madonna'

EcomSearch.dslMiddlewares.push((dsl) => {
  const storeFilter = {
    nested: {
      path: 'specs',
      query: {
        bool: {
          filter: [{
            term: { 'specs.grid': 'store' }
          }, {
            terms: { 'specs.text': [storeSpec] }
          }]
        }
      }
    }
  }
  const { filter } = (dsl.query && dsl.query.bool) || {}
  if (filter) {
    filter.push(storeFilter)
    return
  }
  merge(dsl, {
    query: {
      bool: { filter: [storeFilter] }
    }
  })
})
