import { ParsedUrlQuery } from 'querystring';
import * as plugins from 'temp/extract-path-plugins';

export interface Plugin {
  /**
   * A function which will be called during path extraction
   */
  exec(path: string): string;
}

export class PathExtractor {
  /**
   * Extract normalized Sitecore item path
   * @param {ParsedUrlQuery} [params]
   */
  public extract(params: ParsedUrlQuery | undefined, rootPath?: string): string {
    if (params === undefined) {
      return rootPath ?? '/';
    }
    let path = Array.isArray(params.path) ? params.path.join('/') : params.path ?? '/';

    //Add root path
    if (rootPath) {
      const rootPathStrippedQueryString = rootPath.split('?')[0];
      path = rootPathStrippedQueryString + (rootPathStrippedQueryString.endsWith('/') ? '' : '/') + path;
    }

    // Ensure leading '/'
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    const extractedPath = (Object.values(plugins) as Plugin[]).reduce(
      (resultPath, plugin) => plugin.exec(resultPath),
      path
    );

    return extractedPath;
  }
}

export const pathExtractor = new PathExtractor();
