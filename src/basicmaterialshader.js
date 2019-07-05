function basicMaterialShader( buffer, depthBuf, offset, depth, u, v, n, face, material ) {

    var colorOffset = offset * 4;

    var texture = textures[ material.map.id ];

    if ( ! texture.data ) return;

    var tdim = texture.width;
    var isTransparent = material.transparent;
    var tbound = tdim - 1;
    var tdata = texture.data;
    var tIndex = ( ( ( v * tdim ) & tbound ) * tdim + ( ( u * tdim ) & tbound ) ) * 4;

    if ( ! isTransparent ) {

        buffer[ colorOffset ] = tdata[ tIndex ];
        buffer[ colorOffset + 1 ] = tdata[ tIndex + 1 ];
        buffer[ colorOffset + 2 ] = tdata[ tIndex + 2 ];
        buffer[ colorOffset + 3 ] = ( material.opacity << 8 ) - 1;
        depthBuf[ offset ] = depth;

    } else {

        var srcR = tdata[ tIndex ];
        var srcG = tdata[ tIndex + 1 ];
        var srcB = tdata[ tIndex + 2 ];
        var opaci = tdata[ tIndex + 3 ] * material.opacity / 255;
        var destR = buffer[ colorOffset ];
        var destG = buffer[ colorOffset + 1 ];
        var destB = buffer[ colorOffset + 2 ];

        buffer[ colorOffset ] = ( srcR * opaci + destR * ( 1 - opaci ) );
        buffer[ colorOffset + 1 ] = ( srcG * opaci + destG * ( 1 - opaci ) );
        buffer[ colorOffset + 2 ] = ( srcB * opaci + destB * ( 1 - opaci ) );
        buffer[ colorOffset + 3 ] = ( material.opacity << 8 ) - 1;

        // Only opaue pixls write to the depth buffer

        if ( buffer[ colorOffset + 3 ] == 255 )	depthBuf[ offset ] = depth;

    }

}