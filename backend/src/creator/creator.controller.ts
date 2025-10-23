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
import { CreatorService } from './creator.service';
import { CreateCreatorDto, UpdateCreatorDto, UpdateCreatorStatusDto, UpdateCreatorTierDto } from './dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities/user.entity';

@ApiTags('Creators')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('creators')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @ApiOperation({ summary: 'Register as creator' })
  @ApiResponse({ status: 201, description: 'Creator profile created successfully' })
  @ApiResponse({ status: 409, description: 'User is already a creator' })
  @Post()
  create(@Body() createCreatorDto: CreateCreatorDto, @Request() req) {
    return this.creatorService.create({
      ...createCreatorDto,
      userId: req.user.id,
    });
  }

  @ApiOperation({ summary: 'Get all creators (Admin only)' })
  @ApiResponse({ status: 200, description: 'Creators retrieved successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.creatorService.findAll();
  }

  @ApiOperation({ summary: 'Get top creators' })
  @ApiResponse({ status: 200, description: 'Top creators retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('top')
  getTopCreators(@Query('limit') limit?: number) {
    return this.creatorService.getTopCreators(limit);
  }

  @ApiOperation({ summary: 'Search creators' })
  @ApiResponse({ status: 200, description: 'Creators search results' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @Get('search')
  searchCreators(@Query('q') query: string) {
    return this.creatorService.searchCreators(query);
  }

  @ApiOperation({ summary: 'Get current user creator profile' })
  @ApiResponse({ status: 200, description: 'Creator profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Creator not found' })
  @Get('me')
  getMyProfile(@Request() req) {
    return this.creatorService.findByUserId(req.user.id);
  }

  @ApiOperation({ summary: 'Get creator by ID' })
  @ApiResponse({ status: 200, description: 'Creator retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Creator not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creatorService.findById(id);
  }

  @ApiOperation({ summary: 'Get creator by creator code' })
  @ApiResponse({ status: 200, description: 'Creator retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Creator not found' })
  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.creatorService.findByCreatorCode(code);
  }

  @ApiOperation({ summary: 'Update current creator profile' })
  @ApiResponse({ status: 200, description: 'Creator profile updated successfully' })
  @Patch('me')
  updateMyProfile(@Request() req, @Body() updateCreatorDto: UpdateCreatorDto) {
    return this.creatorService.update(req.user.creator.id, updateCreatorDto);
  }

  @ApiOperation({ summary: 'Update creator by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Creator updated successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreatorDto: UpdateCreatorDto) {
    return this.creatorService.update(id, updateCreatorDto);
  }

  @ApiOperation({ summary: 'Update creator status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Creator status updated successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateCreatorStatusDto) {
    return this.creatorService.updateStatus(id, updateStatusDto.status);
  }

  @ApiOperation({ summary: 'Update creator tier (Admin only)' })
  @ApiResponse({ status: 200, description: 'Creator tier updated successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id/tier')
  updateTier(@Param('id') id: string, @Body() updateTierDto: UpdateCreatorTierDto) {
    return this.creatorService.updateTier(id, updateTierDto.tier);
  }

  @ApiOperation({ summary: 'Delete creator (Admin only)' })
  @ApiResponse({ status: 200, description: 'Creator deleted successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creatorService.remove(id);
  }
}