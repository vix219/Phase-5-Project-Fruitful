"""Initial migration with correct foreign keys

Revision ID: 7bfb54e0b198
Revises: 
Create Date: 2025-04-24 09:59:34.015331

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7bfb54e0b198'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('fruit_types',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('fruit_name', sa.String(), nullable=False),
    sa.Column('image_url', sa.String(), nullable=False),
    sa.Column('info', sa.String(), nullable=False),
    sa.Column('season', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('_password_hash', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('trees',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('lat', sa.Float(), nullable=False),
    sa.Column('lng', sa.Float(), nullable=False),
    sa.Column('fruit_type_id', sa.Integer(), nullable=False),
    sa.Column('notes', sa.String(length=200), nullable=True),
    sa.ForeignKeyConstraint(['fruit_type_id'], ['fruit_types.id'], name=op.f('fk_trees_fruit_type_id_fruit_types')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_trees_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('trees')
    op.drop_table('users')
    op.drop_table('fruit_types')
    # ### end Alembic commands ###
