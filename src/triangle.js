function drawTriangle( v1, v2, v3, uv1, uv2, uv3, shader, face, material ) {

    // TODO: Implement per-pixel z-clipping

    if ( v1.z < - 1 || v1.z > 1 || v2.z < - 1 || v2.z > 1 || v3.z < - 1 || v3.z > 1 ) return;

    // https://gist.github.com/2486101
    // explanation: http://pouet.net/topic.php?which=8760&page=1

    var fixscale = ( 1 << subpixelBits );

    // 28.4 fixed-point coordinates

    var x1 = ( v1.x * viewportXScale + viewportXOffs ) | 0;
    var x2 = ( v2.x * viewportXScale + viewportXOffs ) | 0;
    var x3 = ( v3.x * viewportXScale + viewportXOffs ) | 0;

    var y1 = ( v1.y * viewportYScale + viewportYOffs ) | 0;
    var y2 = ( v2.y * viewportYScale + viewportYOffs ) | 0;
    var y3 = ( v3.y * viewportYScale + viewportYOffs ) | 0;

    var bHasNormal = face.vertexNormalsModel && face.vertexNormalsModel.length;
    var bHasUV = uv1 && uv2 && uv3;

    var longestSide = Math.max(
        Math.sqrt( ( x1 - x2 ) * ( x1 - x2 ) + ( y1 - y2 ) * ( y1 - y2 ) ),
        Math.sqrt( ( x2 - x3 ) * ( x2 - x3 ) + ( y2 - y3 ) * ( y2 - y3 ) ),
        Math.sqrt( ( x3 - x1 ) * ( x3 - x1 ) + ( y3 - y1 ) * ( y3 - y1 ) )
    );

    if ( ! ( face instanceof THREE.RenderableSprite ) && ( longestSide > 100 * fixscale ) ) {

        // 1
        // |\
        // |a\
        // |__\
        // |\c|\
        // |b\|d\
        // |__\__\
        // 2      3
        var tempFace = { vertexNormalsModel: [], color: face.color };
        var mpUV12, mpUV23, mpUV31;

        if ( bHasUV ) {

            if ( mpUVPoolCount === mpUVPool.length ) {

                mpUV12 = new THREE.Vector2();
                mpUVPool.push( mpUV12 );
                ++ mpUVPoolCount;

                mpUV23 = new THREE.Vector2();
                mpUVPool.push( mpUV23 );
                ++ mpUVPoolCount;

                mpUV31 = new THREE.Vector2();
                mpUVPool.push( mpUV31 );
                ++ mpUVPoolCount;

            } else {

                mpUV12 = mpUVPool[ mpUVPoolCount ];
                ++ mpUVPoolCount;

                mpUV23 = mpUVPool[ mpUVPoolCount ];
                ++ mpUVPoolCount;

                mpUV31 = mpUVPool[ mpUVPoolCount ];
                ++ mpUVPoolCount;

            }

            var weight;

            weight = ( 1 + v2.z ) * ( v2.w / v1.w ) / ( 1 + v1.z );
            mpUV12.copy( uv1 ).multiplyScalar( weight ).add( uv2 ).multiplyScalar( 1 / ( weight + 1 ) );

            weight = ( 1 + v3.z ) * ( v3.w / v2.w ) / ( 1 + v2.z );
            mpUV23.copy( uv2 ).multiplyScalar( weight ).add( uv3 ).multiplyScalar( 1 / ( weight + 1 ) );

            weight = ( 1 + v1.z ) * ( v1.w / v3.w ) / ( 1 + v3.z );
            mpUV31.copy( uv3 ).multiplyScalar( weight ).add( uv1 ).multiplyScalar( 1 / ( weight + 1 ) );

        }

        var mpV12, mpV23, mpV31;

        if ( mpVPoolCount === mpVPool.length ) {

            mpV12 = new THREE.Vector4();
            mpVPool.push( mpV12 );
            ++ mpVPoolCount;

            mpV23 = new THREE.Vector4();
            mpVPool.push( mpV23 );
            ++ mpVPoolCount;

            mpV31 = new THREE.Vector4();
            mpVPool.push( mpV31 );
            ++ mpVPoolCount;

        } else {

            mpV12 = mpVPool[ mpVPoolCount ];
            ++ mpVPoolCount;

            mpV23 = mpVPool[ mpVPoolCount ];
            ++ mpVPoolCount;

            mpV31 = mpVPool[ mpVPoolCount ];
            ++ mpVPoolCount;

        }

        mpV12.copy( v1 ).add( v2 ).multiplyScalar( 0.5 );
        mpV23.copy( v2 ).add( v3 ).multiplyScalar( 0.5 );
        mpV31.copy( v3 ).add( v1 ).multiplyScalar( 0.5 );

        var mpN12, mpN23, mpN31;

        if ( bHasNormal ) {

            if ( mpNPoolCount === mpNPool.length ) {

                mpN12 = new THREE.Vector3();
                mpNPool.push( mpN12 );
                ++ mpNPoolCount;

                mpN23 = new THREE.Vector3();
                mpNPool.push( mpN23 );
                ++ mpNPoolCount;

                mpN31 = new THREE.Vector3();
                mpNPool.push( mpN31 );
                ++ mpNPoolCount;

            } else {

                mpN12 = mpNPool[ mpNPoolCount ];
                ++ mpNPoolCount;

                mpN23 = mpNPool[ mpNPoolCount ];
                ++ mpNPoolCount;

                mpN31 = mpNPool[ mpNPoolCount ];
                ++ mpNPoolCount;

            }

            mpN12.copy( face.vertexNormalsModel[ 0 ] ).add( face.vertexNormalsModel[ 1 ] ).normalize();
            mpN23.copy( face.vertexNormalsModel[ 1 ] ).add( face.vertexNormalsModel[ 2 ] ).normalize();
            mpN31.copy( face.vertexNormalsModel[ 2 ] ).add( face.vertexNormalsModel[ 0 ] ).normalize();

        }

        // a
        if ( bHasNormal ) {

            tempFace.vertexNormalsModel[ 0 ] = face.vertexNormalsModel[ 0 ];
            tempFace.vertexNormalsModel[ 1 ] = mpN12;
            tempFace.vertexNormalsModel[ 2 ] = mpN31;

        }

        drawTriangle( v1, mpV12, mpV31, uv1, mpUV12, mpUV31, shader, tempFace, material );

        // b
        if ( bHasNormal ) {

            tempFace.vertexNormalsModel[ 0 ] = face.vertexNormalsModel[ 1 ];
            tempFace.vertexNormalsModel[ 1 ] = mpN23;
            tempFace.vertexNormalsModel[ 2 ] = mpN12;

        }

        drawTriangle( v2, mpV23, mpV12, uv2, mpUV23, mpUV12, shader, tempFace, material );

        // c
        if ( bHasNormal ) {

            tempFace.vertexNormalsModel[ 0 ] = mpN12;
            tempFace.vertexNormalsModel[ 1 ] = mpN23;
            tempFace.vertexNormalsModel[ 2 ] = mpN31;

        }

        drawTriangle( mpV12, mpV23, mpV31, mpUV12, mpUV23, mpUV31, shader, tempFace, material );

        // d
        if ( bHasNormal ) {

            tempFace.vertexNormalsModel[ 0 ] = face.vertexNormalsModel[ 2 ];
            tempFace.vertexNormalsModel[ 1 ] = mpN31;
            tempFace.vertexNormalsModel[ 2 ] = mpN23;

        }

        drawTriangle( v3, mpV31, mpV23, uv3, mpUV31, mpUV23, shader, tempFace, material );

        return;

    }

    // Z values (.28 fixed-point)

    var z1 = ( v1.z * viewportZScale + viewportZOffs ) | 0;
    var z2 = ( v2.z * viewportZScale + viewportZOffs ) | 0;
    var z3 = ( v3.z * viewportZScale + viewportZOffs ) | 0;

    // UV values
    var bHasUV = false;
    var tu1, tv1, tu2, tv2, tu3, tv3;

    if ( uv1 && uv2 && uv3 ) {

        bHasUV = true;

        tu1 = uv1.x;
        tv1 = 1 - uv1.y;
        tu2 = uv2.x;
        tv2 = 1 - uv2.y;
        tu3 = uv3.x;
        tv3 = 1 - uv3.y;

    }

    // Normal values
    var n1, n2, n3, nz1, nz2, nz3;

    if ( bHasNormal ) {

        n1 = face.vertexNormalsModel[ 0 ];
        n2 = face.vertexNormalsModel[ 1 ];
        n3 = face.vertexNormalsModel[ 2 ];
        nz1 = n1.z * 255;
        nz2 = n2.z * 255;
        nz3 = n3.z * 255;

    }

    // Deltas

    var dx12 = x1 - x2, dy12 = y2 - y1;
    var dx23 = x2 - x3, dy23 = y3 - y2;
    var dx31 = x3 - x1, dy31 = y1 - y3;

    // Bounding rectangle

    var minx = Math.max( ( Math.min( x1, x2, x3 ) + subpixelBias ) >> subpixelBits, 0 );
    var maxx = Math.min( ( Math.max( x1, x2, x3 ) + subpixelBias ) >> subpixelBits, canvasWidth );
    var miny = Math.max( ( Math.min( y1, y2, y3 ) + subpixelBias ) >> subpixelBits, 0 );
    var maxy = Math.min( ( Math.max( y1, y2, y3 ) + subpixelBias ) >> subpixelBits, canvasHeight );

    rectx1 = Math.min( minx, rectx1 );
    rectx2 = Math.max( maxx, rectx2 );
    recty1 = Math.min( miny, recty1 );
    recty2 = Math.max( maxy, recty2 );

    // Block size, standard 8x8 (must be power of two)

    var q = blockSize;

    // Start in corner of 8x8 block

    minx &= ~ ( q - 1 );
    miny &= ~ ( q - 1 );

    // Constant part of half-edge functions

    var minXfixscale = ( minx << subpixelBits );
    var minYfixscale = ( miny << subpixelBits );

    var c1 = dy12 * ( ( minXfixscale ) - x1 ) + dx12 * ( ( minYfixscale ) - y1 );
    var c2 = dy23 * ( ( minXfixscale ) - x2 ) + dx23 * ( ( minYfixscale ) - y2 );
    var c3 = dy31 * ( ( minXfixscale ) - x3 ) + dx31 * ( ( minYfixscale ) - y3 );

    // Correct for fill convention

    if ( dy12 > 0 || ( dy12 == 0 && dx12 > 0 ) ) c1 ++;
    if ( dy23 > 0 || ( dy23 == 0 && dx23 > 0 ) ) c2 ++;
    if ( dy31 > 0 || ( dy31 == 0 && dx31 > 0 ) ) c3 ++;

    // Note this doesn't kill subpixel precision, but only because we test for >=0 (not >0).
    // It's a bit subtle. :)
    c1 = ( c1 - 1 ) >> subpixelBits;
    c2 = ( c2 - 1 ) >> subpixelBits;
    c3 = ( c3 - 1 ) >> subpixelBits;

    // Z interpolation setup

    var dz12 = z1 - z2, dz31 = z3 - z1;
    var invDet = 1.0 / ( dx12 * dy31 - dx31 * dy12 );
    var dzdx = ( invDet * ( dz12 * dy31 - dz31 * dy12 ) ); // dz per one subpixel step in x
    var dzdy = ( invDet * ( dz12 * dx31 - dx12 * dz31 ) ); // dz per one subpixel step in y

    // Z at top/left corner of rast area

    var cz = ( z1 + ( ( minXfixscale ) - x1 ) * dzdx + ( ( minYfixscale ) - y1 ) * dzdy ) | 0;

    // Z pixel steps

    dzdx = ( dzdx * fixscale ) | 0;
    dzdy = ( dzdy * fixscale ) | 0;

    var dtvdx, dtvdy, cbtu, cbtv;
    if ( bHasUV ) {

        // UV interpolation setup
        var dtu12 = tu1 - tu2, dtu31 = tu3 - tu1;
        var dtudx = ( invDet * ( dtu12 * dy31 - dtu31 * dy12 ) ); // dtu per one subpixel step in x
        var dtudy = ( invDet * ( dtu12 * dx31 - dx12 * dtu31 ) ); // dtu per one subpixel step in y
        var dtv12 = tv1 - tv2, dtv31 = tv3 - tv1;
        dtvdx = ( invDet * ( dtv12 * dy31 - dtv31 * dy12 ) ); // dtv per one subpixel step in x
        dtvdy = ( invDet * ( dtv12 * dx31 - dx12 * dtv31 ) ); // dtv per one subpixel step in y

        // UV at top/left corner of rast area
        cbtu = ( tu1 + ( minXfixscale - x1 ) * dtudx + ( minYfixscale - y1 ) * dtudy );
        cbtv = ( tv1 + ( minXfixscale - x1 ) * dtvdx + ( minYfixscale - y1 ) * dtvdy );

        // UV pixel steps
        dtudx = dtudx * fixscale;
        dtudy = dtudy * fixscale;
        dtvdx = dtvdx * fixscale;
        dtvdy = dtvdy * fixscale;

    }

    var dnzdy, cbnz;

    if ( bHasNormal ) {

         // Normal interpolation setup
        var dnz12 = nz1 - nz2, dnz31 = nz3 - nz1;
        var dnzdx = ( invDet * ( dnz12 * dy31 - dnz31 * dy12 ) ); // dnz per one subpixel step in x
        var dnzdy = ( invDet * ( dnz12 * dx31 - dx12 * dnz31 ) ); // dnz per one subpixel step in y

        // Normal at top/left corner of rast area
        cbnz = ( nz1 + ( minXfixscale - x1 ) * dnzdx + ( minYfixscale - y1 ) * dnzdy );

        // Normal pixel steps
        dnzdx = ( dnzdx * fixscale );
        dnzdy = ( dnzdy * fixscale );

    }

    // Set up min/max corners
    var qm1 = q - 1; // for convenience
    var nmin1 = 0, nmax1 = 0;
    var nmin2 = 0, nmax2 = 0;
    var nmin3 = 0, nmax3 = 0;
    var nminz = 0, nmaxz = 0;
    if ( dx12 >= 0 ) nmax1 -= qm1 * dx12; else nmin1 -= qm1 * dx12;
    if ( dy12 >= 0 ) nmax1 -= qm1 * dy12; else nmin1 -= qm1 * dy12;
    if ( dx23 >= 0 ) nmax2 -= qm1 * dx23; else nmin2 -= qm1 * dx23;
    if ( dy23 >= 0 ) nmax2 -= qm1 * dy23; else nmin2 -= qm1 * dy23;
    if ( dx31 >= 0 ) nmax3 -= qm1 * dx31; else nmin3 -= qm1 * dx31;
    if ( dy31 >= 0 ) nmax3 -= qm1 * dy31; else nmin3 -= qm1 * dy31;
    if ( dzdx >= 0 ) nmaxz += qm1 * dzdx; else nminz += qm1 * dzdx;
    if ( dzdy >= 0 ) nmaxz += qm1 * dzdy; else nminz += qm1 * dzdy;

    // Loop through blocks
    var linestep = canvasWidth - q;

    var cb1 = c1;
    var cb2 = c2;
    var cb3 = c3;
    var cbz = cz;
    var qstep = - q;
    var e1x = qstep * dy12;
    var e2x = qstep * dy23;
    var e3x = qstep * dy31;
    var ezx = qstep * dzdx;

    var etux, etvx;
    if ( bHasUV ) {

        etux = qstep * dtudx;
        etvx = qstep * dtvdx;

    }

    var enzx;
    if ( bHasNormal ) {

        enzx = qstep * dnzdx;

    }

    var x0 = minx;

    for ( var y0 = miny; y0 < maxy; y0 += q ) {

        // New block line - keep hunting for tri outer edge in old block line dir
        while ( x0 >= minx && x0 < maxx && cb1 >= nmax1 && cb2 >= nmax2 && cb3 >= nmax3 ) {

            x0 += qstep;
            cb1 += e1x;
            cb2 += e2x;
            cb3 += e3x;
            cbz += ezx;

            if ( bHasUV ) {

                cbtu += etux;
                cbtv += etvx;

            }

            if ( bHasNormal ) {

                cbnz += enzx;

            }

        }

        // Okay, we're now in a block we know is outside. Reverse direction and go into main loop.
        qstep = - qstep;
        e1x = - e1x;
        e2x = - e2x;
        e3x = - e3x;
        ezx = - ezx;

        if ( bHasUV ) {

            etux = - etux;
            etvx = - etvx;

        }

        if ( bHasNormal ) {

            enzx = - enzx;

        }

        while ( 1 ) {

            // Step everything
            x0 += qstep;
            cb1 += e1x;
            cb2 += e2x;
            cb3 += e3x;
            cbz += ezx;

            if ( bHasUV ) {

                cbtu += etux;
                cbtv += etvx;

            }

            if ( bHasNormal ) {

                cbnz += enzx;

            }

            // We're done with this block line when at least one edge completely out
            // If an edge function is too small and decreasing in the current traversal
            // dir, we're done with this line.
            if ( x0 < minx || x0 >= maxx ) break;
            if ( cb1 < nmax1 ) if ( e1x < 0 ) break; else continue;
            if ( cb2 < nmax2 ) if ( e2x < 0 ) break; else continue;
            if ( cb3 < nmax3 ) if ( e3x < 0 ) break; else continue;

            // We can skip this block if it's already fully covered
            var blockX = x0 >> blockShift;
            var blockY = y0 >> blockShift;
            var blockId = blockX + blockY * canvasWBlocks;
            var minz = cbz + nminz;

            // farthest point in block closer than closest point in our tri?
            if ( blockMaxZ[ blockId ] < minz ) continue;

            // Need to do a deferred clear?
            var bflags = blockFlags[ blockId ];
            if ( bflags & BLOCK_NEEDCLEAR ) clearBlock( blockX, blockY );
            blockFlags[ blockId ] = bflags & ~ ( BLOCK_ISCLEAR | BLOCK_NEEDCLEAR );

            // Offset at top-left corner
            var offset = x0 + y0 * canvasWidth;

            // Accept whole block when fully covered
            if ( cb1 >= nmin1 && cb2 >= nmin2 && cb3 >= nmin3 ) {

                var maxz = cbz + nmaxz;
                blockMaxZ[ blockId ] = Math.min( blockMaxZ[ blockId ], maxz );

                var cy1 = cb1;
                var cy2 = cb2;
                var cyz = cbz;

                var cytu, cytv;
                if ( bHasUV ) {

                    cytu = cbtu;
                    cytv = cbtv;

                }

                var cynz;
                if ( bHasNormal ) {

                    cynz = cbnz;

                }


                for ( var iy = 0; iy < q; iy ++ ) {

                    var cx1 = cy1;
                    var cx2 = cy2;
                    var cxz = cyz;

                    var cxtu;
                    var cxtv;
                    if ( bHasUV ) {

                        cxtu = cytu;
                        cxtv = cytv;

                    }

                    var cxnz;
                    if ( bHasNormal ) {

                        cxnz = cynz;

                    }

                    for ( var ix = 0; ix < q; ix ++ ) {

                        var z = cxz;

                        if ( z < zbuffer[ offset ] ) {

                            shader( data, zbuffer, offset, z, cxtu, cxtv, cxnz, face, material );

                        }

                        cx1 += dy12;
                        cx2 += dy23;
                        cxz += dzdx;

                        if ( bHasUV ) {

                            cxtu += dtudx;
                            cxtv += dtvdx;

                        }

                        if ( bHasNormal ) {

                            cxnz += dnzdx;

                        }

                        offset ++;

                    }

                    cy1 += dx12;
                    cy2 += dx23;
                    cyz += dzdy;

                    if ( bHasUV ) {

                        cytu += dtudy;
                        cytv += dtvdy;

                    }

                    if ( bHasNormal ) {

                        cynz += dnzdy;

                    }

                    offset += linestep;

                }

            } else {

                // Partially covered block

                var cy1 = cb1;
                var cy2 = cb2;
                var cy3 = cb3;
                var cyz = cbz;

                var cytu, cytv;
                if ( bHasUV ) {

                    cytu = cbtu;
                    cytv = cbtv;

                }

                var cynz;
                if ( bHasNormal ) {

                    cynz = cbnz;

                }

                for ( var iy = 0; iy < q; iy ++ ) {

                    var cx1 = cy1;
                    var cx2 = cy2;
                    var cx3 = cy3;
                    var cxz = cyz;

                    var cxtu;
                    var cxtv;
                    if ( bHasUV ) {

                        cxtu = cytu;
                        cxtv = cytv;

                    }

                    var cxnz;
                    if ( bHasNormal ) {

                        cxnz = cynz;

                    }

                    for ( var ix = 0; ix < q; ix ++ ) {

                        if ( ( cx1 | cx2 | cx3 ) >= 0 ) {

                            var z = cxz;

                            if ( z < zbuffer[ offset ] ) {

                                shader( data, zbuffer, offset, z, cxtu, cxtv, cxnz, face, material );

                            }

                        }

                        cx1 += dy12;
                        cx2 += dy23;
                        cx3 += dy31;
                        cxz += dzdx;

                        if ( bHasUV ) {

                            cxtu += dtudx;
                            cxtv += dtvdx;

                        }

                        if ( bHasNormal ) {

                            cxnz += dnzdx;

                        }

                        offset ++;

                    }

                    cy1 += dx12;
                    cy2 += dx23;
                    cy3 += dx31;
                    cyz += dzdy;

                    if ( bHasUV ) {

                        cytu += dtudy;
                        cytv += dtvdy;

                    }

                    if ( bHasNormal ) {

                        cynz += dnzdy;

                    }

                    offset += linestep;

                }

            }

        }

        // Advance to next row of blocks
        cb1 += q * dx12;
        cb2 += q * dx23;
        cb3 += q * dx31;
        cbz += q * dzdy;

        if ( bHasUV ) {

            cbtu += q * dtudy;
            cbtv += q * dtvdy;

        }

        if ( bHasNormal ) {

            cbnz += q * dnzdy;

        }

    }

}