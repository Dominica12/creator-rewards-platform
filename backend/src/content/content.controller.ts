import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto, UpdateContentStatsDto } from './dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities/user.entity';
import { ContentStatus } from '../entities/content.entity';

@ApiTags('Content')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  @Post()
  create(@Body() createContentDto: CreateContentDto, @Request() req) {
    return this.contentService.create({
      ...createContentDto,
      creatorId: req.user.creator?.id || createContentDto.creatorId,
    });
  }

  @ApiOperation({ summary: 'Get all content with optional filters' })
  @ApiResponse({ status: 200, description: 'Content retrieved successfully' })
  @ApiQuery({ name: 'creatorId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ContentStatus })
  @Get()
  findAll(
    @Query('creatorId') creatorId?: string,
    @Query('status') status?: ContentStatus,
  ) {
    return this.contentService.findAll(creatorId, status);
  }

  @ApiOperation({ summary: 'Get top performing content' })
  @ApiResponse({ status: 200, description: 'Top content retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'timeframe', required: false, enum: ['day', 'week', 'month'] })
  @Get('top')
  getTopContent(
    @Query('limit') limit?: number,
    @Query('timeframe') timeframe?: 'day' | 'week' | 'month',
  ) {
    return this.contentService.getTopContent(limit, timeframe);
  }

  @ApiOperation({ summary: 'Search content' })
  @ApiResponse({ status: 200, description: 'Content search results' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @Get('search')
  searchContent(@Query('q') query: string) {
    return this.contentService.searchContent(query);
  }

  @ApiOperation({ summary: 'Get current creator content' })
  @ApiResponse({ status: 200, description: 'Creator content retrieved successfully' })
  @Get('my-content')
  getMyContent(@Request() req) {
    return this.contentService.findByCreator(req.user.creator.id);
  }

  @ApiOperation({ summary: 'Get content analytics for creator' })
  @ApiResponse({ status: 200, description: 'Content analytics retrieved successfully' })
  @ApiQuery({ name: 'timeframe', required: false, enum: ['day', 'week', 'month'] })
  @Get('analytics')
  getContentAnalytics(
    @Request() req,
    @Query('timeframe') timeframe?: 'day' | 'week' | 'month',
  ) {
    return this.contentService.getContentAnalytics(req.user.creator.id, timeframe);
  }

  @ApiOperation({ summary: 'Get content by platform' })
  @ApiResponse({ status: 200, description: 'Platform content retrieved successfully' })
  @ApiQuery({ name: 'creatorId', required: false, type: String })
  @Get('platform/:platform')
  getContentByPlatform(
    @Param('platform') platform: string,
    @Query('creatorId') creatorId?: string,
  ) {
    return this.contentService.findByPlatform(platform, creatorId);
  }

  @ApiOperation({ summary: 'Get content by ID' })
  @ApiResponse({ status: 200, description: 'Content retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.findById(id);
  }

  @ApiOperation({ summary: 'Update content' })
  @ApiResponse({ status: 200, description: 'Content updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not content owner' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
    @Request() req,
  ) {
    return this.contentService.update(id, updateContentDto, req.user.id);
  }

  @ApiOperation({ summary: 'Update content status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Content status updated successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ContentStatus,
  ) {
    return this.contentService.updateStatus(id, status);
  }

  @ApiOperation({ summary: 'Update content engagement stats' })
  @ApiResponse({ status: 200, description: 'Content stats updated successfully' })
  @Patch(':id/stats')
  updateStats(
    @Param('id') id: string,
    @Body() updateStatsDto: UpdateContentStatsDto,
  ) {
    return this.contentService.updateStats(id, updateStatsDto);
  }

  @ApiOperation({ summary: 'Delete content' })
  @ApiResponse({ status: 200, description: 'Content deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not content owner' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.contentService.remove(id, req.user.id);
  }
}