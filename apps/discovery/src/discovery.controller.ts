import { Controller, Get, HttpStatus, Inject, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import axios from 'axios';

import { OrderType, PaginationResponseDto, Program } from '@app/shared';

import { DiscoveryService } from './discovery.service';


@ApiTags('discovery')
@Controller('discovery')
export class DiscoveryController {
  constructor(
    private readonly discoveryService: DiscoveryService, 
    private configService: ConfigService,
    @Inject('CMS_SERVICE') 
    private cmsClient: ClientProxy
  ) { }

  @Get('search')
  @ApiQuery({ name: 'orderBy', required: false, type: String})
  @ApiQuery({ name: 'order', required: false, type: String})
  @ApiOperation({ summary: 'Search for programs' })
  @ApiResponse({ status: 200, description: 'Search results', type: [Program] })
  search(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: OrderType
  ): Promise<PaginationResponseDto<Program>> {
    return this.discoveryService.search(query, orderBy, order, page, limit);
  }

  @Get('downloadAxios/:filename')
  async downloadAxios(@Param('filename') filename: string, @Res() res: Response) {
    try {
      // Replace with your actual CMS service URL and port
      const cmsUrl =  this.configService.get('BASE_URL') + `/api/streams/${encodeURIComponent(filename)}`;
      console.log('cmsUrl', cmsUrl);
      const cmsResponse = await axios.get(cmsUrl, { responseType: 'stream' });

      res.set(cmsResponse.headers);
      cmsResponse.data.pipe(res);
    } catch (err) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found or CMS unavailable' });
    }
  }

  @Get('downloadMicroservice/:filename')
  async downloadFileMicroservice(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const fileBuffer: Buffer = await firstValueFrom(
        this.cmsClient.send('get_file_buffer', filename)
      );
      res.setHeader('Content-Type', 'video/mp4'); // or use mime-types to detect
      res.setHeader('Content-Disposition', `attachment; filename=\"${filename}\"`);
      res.send(fileBuffer);
    } catch (err) {
      console.log('err', err);
      res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found or CMS unavailable' });
    }
  }
}

